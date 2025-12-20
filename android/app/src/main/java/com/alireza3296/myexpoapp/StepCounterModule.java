package com.alireza3296.myexpoapp;

import android.content.Intent;
import android.os.Build;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class StepCounterModule extends ReactContextBaseJavaModule {

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
}
