FULL STEP-BY-STEP TUTORIAL FOR ANDROID BACKGROUND STEP COUNTER

---

PHASE 0: PRECONDITIONS
1. Target device: Android (Galaxy A20 / similar).
2. Development environment: Node.js, Expo CLI, Android Studio.
3. Current app: React Native + Expo sensors.
4. Goal: Keep step counting alive when screen is off or app is backgrounded.

---

PHASE 1: MOVE TO EXPO BARE WORKFLOW
1. Run `npx expo prebuild` to generate `/android` and `/ios` folders.
2. Keep React Native components as-is.
3. Optionally install libraries: `react-native-foreground-service`, `react-native-notifications`.

---

PHASE 2: CREATE ANDROID FOREGROUND SERVICE
1. Create `StepCounterService.java` in `/android/app/src/main/java/.../`.
2. Foreground Service requirements:
   - Persistent, non-dismissible notification.
   - Starts immediately after launch.
   - Handles app background / screen off.
3. Update `AndroidManifest.xml`:
```xml
<service android:name=".StepCounterService" android:foregroundServiceType="dataSync" android:exported="false" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
```
4. Notification example:
```java
Notification notification = new NotificationCompat.Builder(this, "STEP_CHANNEL")
        .setContentTitle("Step tracking active")
        .setContentText("Counting steps in the background")
        .setSmallIcon(R.drawable.ic_walk)
        .setOngoing(true)
        .build();
startForeground(1, notification);
```

---

PHASE 3: SENSOR HANDLING IN NATIVE SERVICE
1. Register sensors in the service:
```java
SensorManager sm = (SensorManager)getSystemService(SENSOR_SERVICE);
Sensor accel = sm.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
sm.registerListener(this, accel, SensorManager.SENSOR_DELAY_GAME);
```
2. Optional: use gyroscope for arm swing/noise rejection.
3. Step detection logic:
   - Gravity normalization
   - Band-pass filter (1.2–4.5 Hz)
   - Peak detection with adaptive threshold
   - Time validation (250–2000 ms)
   - Cadence classification
   - State machine (IDLE → WALK → RUN)

---

PHASE 4: DATA STORAGE & JS BRIDGE
1. Store step counts in `SharedPreferences`, SQLite, or Room DB.
2. Expose NativeModule to React Native:
```java
@ReactMethod
public int getCurrentSteps() { ... }
```
3. Read in JS:
```js
const steps = await StepCounter.getCurrentSteps();
setSteps(steps);
```
4. Optional: send live updates via EventEmitter.

---

PHASE 5: START / STOP FOREGROUND SERVICE
1. From React Native UI:
```js
import { NativeModules } from 'react-native';
NativeModules.StepCounter.startService();
NativeModules.StepCounter.stopService();
```
2. User flow:
   - Tap “Start tracking” → service starts
   - Tap “Stop tracking” → service stops
   - Notification always visible while service active

---

PHASE 6: BATTERY OPTIMIZATION HANDLING (SAMSUNG)
1. Ask user to whitelist app from battery optimization:
```java
Intent intent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
startActivity(intent);
```
2. Explain in-app why it is needed for accurate step counting.

---

PHASE 7: CALIBRATION & ACCURACY
1. Optional 30-second user calibration:
   - Measure baseline peak amplitude
   - Typical cadence
   - Adjust thresholds dynamically
2. Handle handheld vs pocket usage:
   - Use gyroscope rotation to reduce false positives
   - Adjust peak threshold

---

PHASE 8: TESTING
1. Test on standalone APK (Expo Go will NOT work).
2. Test scenarios:
   - App foreground / screen on
   - App background / home button
   - Screen off / lock
   - Short-term idle
3. Verify:
   - Notification persists
   - Steps count continues
   - Battery consumption acceptable

---

PHASE 9: DEPLOYMENT
1. Build APK / AAB: `eas build --platform android`
2. Sign and upload to Play Store.
3. Provide user instructions:
   - Start tracking before screen off
   - Turn off battery optimization

---

PHASE 10: OPTIONAL ENHANCEMENTS
- Live UI updates via EventEmitter
- Step history in SQLite / AsyncStorage
- Graphs for steps, distance, calories
- Alerts if service stops
- Handle phone reboot with BOOT_COMPLETED receiver (optional)

---

KEY TAKEAWAYS
- Expo Go / Managed → cannot survive background / screen off.
- Foreground Service + Notification → mandatory.
- Native implementation required for step detection.
- Battery optimization handling is crucial on Samsung devices.

---
END OF ROADMAP

