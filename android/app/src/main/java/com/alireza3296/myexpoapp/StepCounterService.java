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

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private PowerManager.WakeLock wakeLock;
    private SharedPreferences sharedPreferences;

    private int stepCount = 0;
    private float lastMagnitude = 0f;
    private long lastStepTime = 0;

    // Step detection variables
    private float gravityX = 0, gravityY = 0, gravityZ = 0;
    private long lastStepRef = 0;
    private float magnitudeEmaRef = 0;
    private float prevMagnitudeRef = 0;
    private boolean inPeakRef = false;
    private boolean gaitLockedRef = false;
    private List<Long> cadenceBufferRef = new ArrayList<>();
    private Handler idleTimeoutHandler;
    private Runnable idleTimeoutRunnable;

    // Step detection parameters - tuned for Android hardware sensors
    private static final float STEP_THRESHOLD = 2.5f;  // Much higher threshold to avoid any hand movements
    private static final float PEAK_DELTA = 1.2f;      // High delta to require significant spikes
    private static final float DOMINANCE_RATIO = 0.8f; // Very high dominance for clear directional movement
    private static final long MIN_STEP_INTERVAL = 250; // Longer interval to prevent false positives
    private static final float RESET_RATIO = 0.8f; // Lower reset ratio for Android (peaks need to drop more)
    private static final float GRAVITY_ALPHA = 0.8f;
    private static final float EMA_ALPHA = 0.05f; // Slower baseline adaptation to reduce sensitivity
    private static final long CADENCE_MIN = 100;
    private static final long CADENCE_MAX = 2000;
    private static final long CADENCE_JITTER = 500;
    private static final int LOCK_BUFFER_SIZE = 2;
    private static final long RESET_TIMEOUT = 2200;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.v(TAG, "Service created");

        // Initialize SharedPreferences
        sharedPreferences = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        stepCount = sharedPreferences.getInt(STEP_COUNT_KEY, 0);
        Log.v(TAG, "Loaded step count from prefs: " + stepCount);

        // Initialize Handler for idle timeout
        idleTimeoutHandler = new Handler();
        idleTimeoutRunnable = new Runnable() {
            @Override
            public void run() {
                if (gaitLockedRef) {
                    gaitLockedRef = false;
                    Log.v(TAG, "GAIT_UNLOCKED: Idle timeout - no peaks detected");
                }
                cadenceBufferRef.clear();
                inPeakRef = false;
            }
        };

        createNotificationChannel();

        Notification notification =
                new NotificationCompat.Builder(this, CHANNEL_ID)
                        .setContentTitle("Step Counter Running")
                        .setContentText("Tracking steps in background")
                        .setSmallIcon(android.R.drawable.ic_dialog_info)
                        .setOngoing(true)
                        .build();

        startForeground(1, notification);

        // WakeLock (CRITICAL)
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        if (pm != null) {
            wakeLock = pm.newWakeLock(
                    PowerManager.PARTIAL_WAKE_LOCK,
                    "StepCounter::WakeLock"
            );
            wakeLock.acquire();
            Log.v(TAG, "WakeLock acquired");
        }

        // Sensor setup
        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager == null) {
            Log.e(TAG, "SensorManager is NULL");
            return;
        }

        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION);
        if (accelerometer == null) {
            Log.e(TAG, "Accelerometer NOT available");
            return;
        }

        sensorManager.registerListener(
                this,
                accelerometer,
                100000 // 100ms in microseconds = 10Hz (exact match for React component)
        );

        Log.v(TAG, "Accelerometer listener registered");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.v(TAG, "Service started");
        return START_STICKY;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        // Accelerometer already provides linear acceleration (gravity removed)
        float linearX = event.values[0];
        float linearY = event.values[1];
        float linearZ = event.values[2];

        float magnitude = (float) Math.sqrt(
                linearX * linearX + linearY * linearY + linearZ * linearZ
        );

        // Short-term baseline to reduce false positives from gentle movements
        if (magnitudeEmaRef == 0) {
            magnitudeEmaRef = magnitude;
        } else {
            magnitudeEmaRef = EMA_ALPHA * magnitude + (1 - EMA_ALPHA) * magnitudeEmaRef;
        }

        float deltaFromBaseline = magnitude - magnitudeEmaRef;
        float dominantAxis = Math.max(
                Math.abs(linearX),
                Math.max(Math.abs(linearY), Math.abs(linearZ))
        );
        float dominance = magnitude > 0 ? dominantAxis / magnitude : 0;

        Log.v(TAG, "DEBUG: LinearMag=" + String.format("%.2f", magnitude) +
                ", Delta=" + String.format("%.2f", deltaFromBaseline) +
                ", Dom=" + String.format("%.2f", dominance) +
                ", InPeak=" + inPeakRef + ", GaitLocked=" + gaitLockedRef + ", Steps=" + stepCount);

        long now = System.currentTimeMillis();
        boolean rising = magnitude > prevMagnitudeRef;

        boolean highHit =
                magnitude > STEP_THRESHOLD &&
                        deltaFromBaseline > PEAK_DELTA &&
                        dominance > DOMINANCE_RATIO &&
                        rising;

        if (!inPeakRef && highHit) {
            long sinceLast = now - lastStepRef;
            Log.v(TAG, "HIGH_HIT: SinceLast=" + sinceLast + "ms, MinInterval=" + MIN_STEP_INTERVAL + "ms");
            if (sinceLast <= MIN_STEP_INTERVAL) {
                Log.v(TAG, "INTERVAL_TOO_SHORT: " + sinceLast + "ms <= " + MIN_STEP_INTERVAL + "ms, skipping");
                prevMagnitudeRef = magnitude;
                return;
            }

            if (!gaitLockedRef) {
                cadenceBufferRef.add(now);
                if (cadenceBufferRef.size() > LOCK_BUFFER_SIZE) {
                    cadenceBufferRef.remove(0);
                }

                if (cadenceBufferRef.size() >= LOCK_BUFFER_SIZE) {
                    List<Long> intervals = new ArrayList<>();
                    for (int i = 1; i < cadenceBufferRef.size(); i++) {
                        intervals.add(cadenceBufferRef.get(i) - cadenceBufferRef.get(i - 1));
                    }

                    long sumIntervals = 0;
                    for (long val : intervals) {
                        sumIntervals += val;
                    }
                    long avgInterval = intervals.isEmpty() ? 0 : sumIntervals / intervals.size();

                    long minInt = Long.MAX_VALUE;
                    long maxInt = Long.MIN_VALUE;
                    if (!intervals.isEmpty()) {
                        for (long val : intervals) {
                            if (val < minInt) minInt = val;
                            if (val > maxInt) maxInt = val;
                        }
                    }
                    long spread = maxInt - minInt;

                    boolean cadenceOk = (
                            avgInterval >= CADENCE_MIN &&
                                    avgInterval <= CADENCE_MAX &&
                                    spread <= CADENCE_JITTER
                    );

                    if (cadenceOk) {
                        gaitLockedRef = true;
                        Log.v(TAG, "GAIT_LOCKED: Walking pattern detected (avg_interval: " + avgInterval + "ms, spread: " + spread + "ms)");
                    }
                }
                lastStepRef = now;
                inPeakRef = true;
            } else {
                boolean cadenceOk = sinceLast >= CADENCE_MIN && sinceLast <= CADENCE_MAX;
                Log.v(TAG, "CADENCE_CHECK: " + sinceLast + "ms, Min=" + CADENCE_MIN + ", Max=" + CADENCE_MAX + ", OK=" + cadenceOk);
                if (cadenceOk) {
                    stepCount++;
                    lastStepTime = now;
                    sharedPreferences.edit().putInt(STEP_COUNT_KEY, stepCount).apply();
                    Log.v(TAG, "STEP_DETECTED: " + stepCount);

                    lastStepRef = now;
                    inPeakRef = true;
                } else if (sinceLast > CADENCE_MAX) {
                    Log.v(TAG, "CADENCE_BREAK: Too slow, unlocking gait");
                    gaitLockedRef = false;
                    cadenceBufferRef.clear();
                    cadenceBufferRef.add(now);
                    lastStepRef = now;
                    inPeakRef = true;
                } else {
                    Log.v(TAG, "CADENCE_TOO_FAST: Waiting for next peak");
                }
            }
        }

        if (inPeakRef && magnitude < STEP_THRESHOLD * RESET_RATIO) {
            Log.v(TAG, "PEAK_RESET: Mag=" + String.format("%.2f", magnitude) + " < " + String.format("%.2f", (STEP_THRESHOLD * RESET_RATIO)));
            inPeakRef = false;
        }

        // Reset idle timeout
        idleTimeoutHandler.removeCallbacks(idleTimeoutRunnable);
        idleTimeoutHandler.postDelayed(idleTimeoutRunnable, RESET_TIMEOUT);

        prevMagnitudeRef = magnitude;
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        // Not used
    }

    @Override
    public void onDestroy() {
        Log.v(TAG, "Service destroyed");

        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }

        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
            Log.v(TAG, "WakeLock released");
        }

        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Step Counter",
                    NotificationManager.IMPORTANCE_LOW
            );
            NotificationManager manager =
                    (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}
