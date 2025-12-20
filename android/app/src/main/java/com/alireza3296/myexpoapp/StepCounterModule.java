package com.alireza3296.myexpoapp;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class StepCounterModule extends ReactContextBaseJavaModule {

    private static final String PREFS_NAME = "StepCounterPrefs";
    private static final String STEP_COUNT_KEY = "stepCount";

    public StepCounterModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "StepCounter";
    }

    @ReactMethod
    public void startService() {
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, StepCounterService.class);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ContextCompat.startForegroundService(context, intent);
        } else {
            context.startService(intent);
        }
    }

    @ReactMethod
    public void stopService() {
        ReactApplicationContext context = getReactApplicationContext();
        Intent intent = new Intent(context, StepCounterService.class);
        context.stopService(intent);
    }

    @ReactMethod
    public void getStepCount(Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            SharedPreferences sharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            int stepCount = sharedPreferences.getInt(STEP_COUNT_KEY, 0);
            promise.resolve(stepCount);
        } catch (Exception e) {
            promise.reject("GET_STEP_COUNT_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void resetStepCount(Promise promise) {
        try {
            ReactApplicationContext context = getReactApplicationContext();
            SharedPreferences sharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            sharedPreferences.edit().putInt(STEP_COUNT_KEY, 0).apply();
            promise.resolve(0);
        } catch (Exception e) {
            promise.reject("RESET_STEP_COUNT_ERROR", e.getMessage());
        }
    }

}
