package com.alireza3296.myexpoapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.os.Handler;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import java.util.ArrayList;
import java.util.List;

public class StepCounterService extends Service implements SensorEventListener {

    private static final String TAG = "StepCounterService";
    private static final String CHANNEL_ID = "STEP_COUNTER_CHANNEL";
    private static final String PREFS_NAME = "StepCounterPrefs";
    private static final String STEP_COUNT_KEY = "stepCount";

    // Movement Qualification Phase (MQP) States
    private enum MQPState {
        IDLE,       // No motion detected, steps = 0
        QUALIFYING, // Collecting motion data to verify if it's real gait
        COUNTING    // Verified gait, counting steps normally
    }

    // Sensors & system
    private SensorManager sensorManager;
    private Sensor linearAccel;
    private PowerManager.WakeLock wakeLock;
    private SharedPreferences prefs;

    // Step state
    private int stepCount = 0;
    private long lastStepTime = 0;
    private long lastCountedStepTime = 0; // Track when the last step was actually counted
    private float prevMagnitude = 0f;
    private float magnitudeEma = 0f;
    private boolean inPeak = false;
    private boolean gaitLocked = false;

    // Movement Qualification Phase (MQP)
    private MQPState mqpState = MQPState.IDLE;
    private long qualificationStartTime = 0;
    private final List<Long> qualTimestamps = new ArrayList<>();
    private final List<Float> qualMagnitudes = new ArrayList<>();
    private final List<Integer> qualDominantAxes = new ArrayList<>();
    private static final long QUALIFICATION_DURATION_MS = 3000; // 3.5 seconds for faster qualification
    private static final int MIN_QUALIFYING_PEAKS = 4; // At least 4 peaks for walking
    private static final float CADENCE_VARIANCE_THRESHOLD = 0.50f; // ±50% variance allowed for walking
    private static final float AXIS_CONSISTENCY_THRESHOLD = 0.6f; // 60% same axis for walking
    private static final float ENERGY_STABILITY_THRESHOLD = 1.0f; // Increased to allow more natural walking variations

    // Cadence
    private final List<Long> cadenceBuffer = new ArrayList<>();
    private static final int LOCK_BUFFER_SIZE = 6;

    // Timing
    private static final long IDLE_RESET_TIMEOUT = 5000; // 5 seconds before reset (increased for robustness)
    private static final long STOP_WALKING_TIMEOUT = 2000; // 4 seconds without steps = stopped walking
    private Handler idleHandler;
    private Runnable idleRunnable;

    // Core thresholds (BASE)
    private static final float BASE_PEAK_DELTA = 0.55f;
    private static final float BASE_DOMINANCE = 0.45f;
    private static final float EMA_ALPHA = 0.08f;

    // Cadence ranges
    private static final long WALK_MIN = 350;
    private static final long WALK_MAX = 2000;
    private static final long RUN_MIN = 120;
    private static final long RUN_MAX = 350;

    // Dynamic
    private float peakDelta = BASE_PEAK_DELTA;
    private float dominanceThreshold = BASE_DOMINANCE;
    private long minStepInterval = RUN_MIN;
    private float resetRatio = 0.7f;

    @Override
    public void onCreate() {
        super.onCreate();

        prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        stepCount = prefs.getInt(STEP_COUNT_KEY, 0);

        idleHandler = new Handler();
        idleRunnable = () -> {
            // Stop-walking logic now handled in onSensorChanged
            // Only handle normal idle timeout for non-COUNTING states
            if (mqpState != MQPState.COUNTING) {
                mqpState = MQPState.IDLE;
                gaitLocked = false;
                cadenceBuffer.clear();
                qualTimestamps.clear();
                qualMagnitudes.clear();
                qualDominantAxes.clear();
                inPeak = false;
                Log.d(TAG, "MQP: → IDLE (idle timeout)");
            }
        };

        createNotificationChannel();
        startForeground(1, buildNotification());

        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "StepCounter::WL");
            wakeLock.acquire();
        }

        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager == null) return;

        linearAccel = sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
        if (linearAccel == null) return;

        sensorManager.registerListener(
                this,
                linearAccel,
                100_000 // 10 Hz
        );

        Log.d(TAG, "Service started, steps=" + stepCount);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        return START_STICKY;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        Log.d(TAG, "CURRENT_MQP_STATE: " + mqpState.name());

        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];

        float magnitude = (float) Math.sqrt(x * x + y * y + z * z);

        // EMA baseline
        if (magnitudeEma == 0f) {
            magnitudeEma = magnitude;
        } else {
            magnitudeEma = EMA_ALPHA * magnitude + (1 - EMA_ALPHA) * magnitudeEma;
        }

        float delta = magnitude - magnitudeEma;
        float dominantAxis = Math.max(Math.abs(x), Math.max(Math.abs(y), Math.abs(z)));
        float dominance = magnitude > 0 ? dominantAxis / magnitude : 0;

        long now = System.currentTimeMillis();
        boolean rising = magnitude > prevMagnitude;

        boolean peakCandidate =
                delta > peakDelta &&
                dominance > dominanceThreshold &&
                rising &&
                !inPeak;

        // Check for stop-walking timeout in COUNTING state
        if (mqpState == MQPState.COUNTING && (now - lastCountedStepTime) >= STOP_WALKING_TIMEOUT) {
            mqpState = MQPState.IDLE;
            gaitLocked = false;
            cadenceBuffer.clear();
            qualTimestamps.clear();
            qualMagnitudes.clear();
            qualDominantAxes.clear();
            inPeak = false;
            updateNotification();
            Log.d(TAG, "MQP: COUNTING → IDLE (stopped walking: 4000ms)");
        }

        // MQP State Machine
        switch (mqpState) {
            case IDLE:
                if (peakCandidate) {
                    // Start qualification phase
                    mqpState = MQPState.QUALIFYING;
                    qualificationStartTime = now;
                    qualTimestamps.clear();
                    qualMagnitudes.clear();
                    qualDominantAxes.clear();
                    qualTimestamps.add(now);
                    qualMagnitudes.add(magnitude);
                    qualDominantAxes.add(getDominantAxisIndex(x, y, z));
                    lastStepTime = now;
                    inPeak = true;
                    updateNotification();
                    Log.d(TAG, "MQP: IDLE → QUALIFYING");
                }
                break;

            case QUALIFYING:
                if (peakCandidate && (now - lastStepTime) >= minStepInterval) {
                    // Collect qualification data
                    qualTimestamps.add(now);
                    qualMagnitudes.add(magnitude);
                    qualDominantAxes.add(getDominantAxisIndex(x, y, z));
                    lastStepTime = now;
                    inPeak = true;

                    Log.d(TAG, "QUALIFYING: peaks=" + qualTimestamps.size() + ", time=" + (now - qualificationStartTime) + "ms");

                    // Check if we have enough data and time
                    if (qualTimestamps.size() >= MIN_QUALIFYING_PEAKS &&
                        (now - qualificationStartTime) >= QUALIFICATION_DURATION_MS) {

                        Log.d(TAG, "VALIDATION: Checking qualification data...");
                        boolean cadenceOk = checkCadenceStability();
                        boolean axisOk = checkAxisConsistency();
                        boolean energyOk = checkEnergyStability();

                        Log.d(TAG, "VALIDATION: cadence=" + cadenceOk + ", axis=" + axisOk + ", energy=" + energyOk);

                        if (cadenceOk && axisOk && energyOk) {
                            // Qualification passed! Start counting
                            mqpState = MQPState.COUNTING;
                            stepCount = qualTimestamps.size()+stepCount; // Start with qualified steps
                            lastCountedStepTime = now; // Initialize stop-walking timer
                            prefs.edit().putInt(STEP_COUNT_KEY, stepCount).apply();

                            // Initialize cadence for counting phase
                            cadenceBuffer.clear();
                            cadenceBuffer.addAll(qualTimestamps);

                            gaitLocked = true;
                            long avgInterval = calculateAverageInterval(qualTimestamps);
                            adjustForCadence(avgInterval);

                            updateNotification();
                            Log.d(TAG, "MQP: QUALIFYING → COUNTING (steps=" + stepCount + ")");
                        } else {
                            // Qualification failed, back to idle
                            mqpState = MQPState.IDLE;
                            updateNotification();
                            Log.d(TAG, "MQP: QUALIFYING → IDLE (failed validation)");
                        }
                    }
                } else if ((now - qualificationStartTime) >= QUALIFICATION_DURATION_MS+1000) {
                    // Timeout without enough peaks
                    mqpState = MQPState.IDLE;
                    updateNotification();
                    Log.d(TAG, "MQP: QUALIFYING → IDLE (timeout)" + peakCandidate + " " + (now - lastStepTime) + " >= " + minStepInterval + (qualTimestamps.size() >= MIN_QUALIFYING_PEAKS &&
                    (now - qualificationStartTime) >= QUALIFICATION_DURATION_MS) + "*********"+ qualTimestamps.size() + " >= " + MIN_QUALIFYING_PEAKS +"&&" + (now - qualificationStartTime) + " >= " + QUALIFICATION_DURATION_MS);
                }
                break;

            case COUNTING:
                if (peakCandidate && (now - lastStepTime) >= minStepInterval) {
                    // Valid step
                    stepCount++;
                    prefs.edit().putInt(STEP_COUNT_KEY, stepCount).apply();
                    lastStepTime = now;
                    lastCountedStepTime = now; // Update when step is actually counted
                    inPeak = true;

                    Log.d(TAG, "STEP " + stepCount);
                }
                break;
        }

        if (inPeak && magnitude < magnitudeEma * resetRatio) {
            inPeak = false;
        }

        idleHandler.removeCallbacks(idleRunnable);
        idleHandler.postDelayed(idleRunnable, IDLE_RESET_TIMEOUT);

        prevMagnitude = magnitude;
    }

    private void adjustForCadence(long interval) {
        if (interval < WALK_MIN) {
            // RUNNING
            peakDelta = 0.4f;
            dominanceThreshold = 0.35f;
            minStepInterval = RUN_MIN;
            resetRatio = 0.6f;
            Log.d(TAG, "MODE: RUN");
        } else {
            // WALKING
            peakDelta = 0.3f;
            dominanceThreshold = 0.5f;
            minStepInterval = WALK_MIN;
            resetRatio = 0.75f;
            Log.d(TAG, "MODE: WALK");
        }
    }

    private int getDominantAxisIndex(float x, float y, float z) {
        float absX = Math.abs(x);
        float absY = Math.abs(y);
        float absZ = Math.abs(z);

        if (absX >= absY && absX >= absZ) return 0; // X axis
        if (absY >= absX && absY >= absZ) return 1; // Y axis
        return 2; // Z axis
    }

    private boolean validateQualificationData() {
        if (qualTimestamps.size() < MIN_QUALIFYING_PEAKS) return false;

        // 1. Cadence stability check
        if (!checkCadenceStability()) return false;

        // 2. Axis dominance consistency check
        if (!checkAxisConsistency()) return false;

        // 3. Energy band stability check
        if (!checkEnergyStability()) return false;

        return true;
    }

    private boolean checkCadenceStability() {
        List<Long> intervals = new ArrayList<>();
        for (int i = 1; i < qualTimestamps.size(); i++) {
            intervals.add(qualTimestamps.get(i) - qualTimestamps.get(i - 1));
        }

        if (intervals.size() < 3) {
            Log.d(TAG, "CADENCE: Not enough intervals (" + intervals.size() + " < 3)");
            return false;
        }

        // Calculate average interval
        long sum = 0;
        for (long interval : intervals) {
            sum += interval;
        }
        double avg = sum / (double) intervals.size();

        // Check variance
        double varianceSum = 0;
        for (long interval : intervals) {
            double diff = interval - avg;
            varianceSum += diff * diff;
        }
        double variance = varianceSum / intervals.size();
        double stdDev = Math.sqrt(variance);
        double coefficientOfVariation = stdDev / avg;

        Log.d(TAG, "CADENCE: avg=" + String.format("%.0f", avg) + "ms, stdDev=" + String.format("%.2f", stdDev) +
                ", coeffVar=" + String.format("%.3f", coefficientOfVariation) + ", threshold=" + CADENCE_VARIANCE_THRESHOLD);

        return coefficientOfVariation <= CADENCE_VARIANCE_THRESHOLD;
    }

    private boolean checkAxisConsistency() {
        if (qualDominantAxes.isEmpty()) {
            Log.d(TAG, "AXIS: No axis data");
            return false;
        }

        int[] axisCounts = new int[3];
        for (int axis : qualDominantAxes) {
            if (axis >= 0 && axis < 3) {
                axisCounts[axis]++;
            }
        }

        int maxCount = Math.max(axisCounts[0], Math.max(axisCounts[1], axisCounts[2]));
        float consistency = maxCount / (float) qualDominantAxes.size();

        Log.d(TAG, "AXIS: X=" + axisCounts[0] + ", Y=" + axisCounts[1] + ", Z=" + axisCounts[2] +
                ", consistency=" + String.format("%.2f", consistency) + ", threshold=" + AXIS_CONSISTENCY_THRESHOLD);

        return consistency >= AXIS_CONSISTENCY_THRESHOLD;
    }

    private boolean checkEnergyStability() {
        if (qualMagnitudes.isEmpty()) {
            Log.d(TAG, "ENERGY: No magnitude data");
            return false;
        }

        float min = Float.MAX_VALUE;
        float max = Float.MIN_VALUE;
        float sum = 0;

        for (float mag : qualMagnitudes) {
            if (mag < min) min = mag;
            if (mag > max) max = mag;
            sum += mag;
        }

        float avg = sum / qualMagnitudes.size();
        float range = max - min;
        float stability = range / avg;

        Log.d(TAG, "ENERGY: min=" + String.format("%.2f", min) + ", max=" + String.format("%.2f", max) +
                ", avg=" + String.format("%.2f", avg) + ", range=" + String.format("%.2f", range) +
                ", stability=" + String.format("%.2f", stability) + ", threshold=" + ENERGY_STABILITY_THRESHOLD);

        return stability <= ENERGY_STABILITY_THRESHOLD;
    }

    private long calculateAverageInterval(List<Long> timestamps) {
        if (timestamps.size() < 2) return WALK_MIN;

        long sum = 0;
        for (int i = 1; i < timestamps.size(); i++) {
            sum += timestamps.get(i) - timestamps.get(i - 1);
        }
        return sum / (timestamps.size() - 1);
    }

    private void updateNotification() {
        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) {
            manager.notify(1, buildNotification());
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    @Override
    public void onDestroy() {
        if (sensorManager != null) sensorManager.unregisterListener(this);
        if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private Notification buildNotification() {
        String title, text;
        switch (mqpState) {
            case QUALIFYING:
                title = "شناسایی حرکت...";
                text = "در حال تشخیص الگوی راه رفتن";
                break;
            case COUNTING:
                title = "قدم شمار فعال";
                text = "شمارش قدم‌ها: " + stepCount;
                break;
            default: // IDLE
                title = "قدم شمار آماده";
                text = "منتظر حرکت برای شروع شمارش";
                break;
        }

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(text)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setOngoing(true)
                .build();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel =
                    new NotificationChannel(
                            CHANNEL_ID,
                            "Step Counter",
                            NotificationManager.IMPORTANCE_LOW
                    );
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }
}

