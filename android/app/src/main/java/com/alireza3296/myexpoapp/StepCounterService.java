package com.alireza3296.myexpoapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import androidx.core.app.NotificationCompat;

public class StepCounterService extends Service implements SensorEventListener {

    private static final String TAG = "StepCounterService";
    private static final String CHANNEL_ID = "STEP_COUNTER_CHANNEL";

    private SensorManager sensorManager;
    private Sensor accelerometer;
    private PowerManager.WakeLock wakeLock;

    private int stepCount = 0;
    private float lastMagnitude = 0f;
    private long lastStepTime = 0;

    // Simple threshold (FOR DEBUG ONLY)
    private static final float STEP_THRESHOLD = 1.2f;
    private static final long STEP_DELAY_MS = 300;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.v(TAG, "Service created");

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
                SensorManager.SENSOR_DELAY_GAME
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
        float x = event.values[0];
        float y = event.values[1];
        float z = event.values[2];

        float magnitude = (float) Math.sqrt(x * x + y * y + z * z);

        Log.v(TAG, "Sensor event: mag=" + magnitude + ", x=" + x + ", y=" + y + ", z=" + z);

        long now = System.currentTimeMillis();

        if (magnitude > STEP_THRESHOLD &&
                lastMagnitude <= STEP_THRESHOLD &&
                (now - lastStepTime) > STEP_DELAY_MS) {

            stepCount++;
            lastStepTime = now;

            Log.v(TAG, "STEP DETECTED: " + stepCount);
        }

        lastMagnitude = magnitude;
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
