import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Alert, AppState } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Text } from './ui/Text';

interface StepCounterProps {
  className?: string;
}

export const StepCounter: React.FC<StepCounterProps> = ({ className }) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    magnitude: 0,
    delta: 0,
    baseline: 0,
    sensorTest: 'none'
  });
  const [listenerCallCount, setListenerCallCount] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  // Step detection variables
  const gravityRef = useRef({ x: 0, y: 0, z: 0 });
  const lastStepRef = useRef(0);
  const magnitudeEmaRef = useRef(0);
  const prevMagnitudeRef = useRef(0);
  const inPeakRef = useRef(false);
  const gaitLockedRef = useRef(false);
  const cadenceBufferRef = useRef<number[]>([]);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscriptionRef = useRef<any>(null);

  // Step detection parameters - tuned for robust gait locking and accurate step counting
  const STEP_THRESHOLD = 1; // Balanced threshold for walking and running
  const PEAK_DELTA = 0.3; // Balanced delta for walking and running
  const DOMINANCE_RATIO = 0.5; // More lenient dominance requirement for varied movements
  const MIN_STEP_INTERVAL = 120; // Very short minimum interval for rapid running steps
  const RESET_RATIO = 0.8; // CRITICAL: Higher reset ratio for easier peak re-arming
  const GRAVITY_ALPHA = 0.8; // Balanced gravity filter adaptation
  const EMA_ALPHA = 0.08; // Balanced smoothing for baseline magnitude
  const CADENCE_MIN = 100; // Low minimum cadence for fast running
  const CADENCE_MAX = 2000; // Broad maximum cadence for slow walking and moderate running
  const CADENCE_JITTER = 500; // More lenient cadence tolerance for varied rhythms
  const LOCK_BUFFER_SIZE = 2; // Requires 2 peaks to initially lock gait (allows one interval calculation)
  const RESET_TIMEOUT = 2200; // Longer idle timeout to prevent premature gait unlocking
  const UPDATE_INTERVAL = 100; // Sensor update interval in ms (10Hz)


  useEffect(() => {
    console.log('Component mounted, checking availability and permissions...', Date.now());
    checkAvailability();
    checkPermissions();

    // Handle app state changes (background/foreground)
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' && isActive) {
        // Pause step counter when app goes to background to prevent coroutine issues
        stopStepCounter();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup function to remove subscription when component unmounts
    return () => {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
    };
  }, [isActive]);

  const checkAvailability = async () => {
    try {
      console.log('Checking Accelerometer availability...');
      const available = await Accelerometer.isAvailableAsync();
      console.log('Accelerometer.isAvailableAsync() returned:', available);
      setIsAvailable(available);
      if (!available) {
        console.log('Accelerometer not available on this device');
        Alert.alert('Accelerometer Not Available', 'Your device does not support motion sensors.');
      } else {
        console.log('Accelerometer is available');
      }
    } catch (error) {
      console.error('Error checking accelerometer availability:', error);
      setIsAvailable(false);
    }
  };

  const checkPermissions = async () => {
    try {
      console.log('Checking Accelerometer permissions...');
      const { granted, status } = await Accelerometer.getPermissionsAsync();
      console.log('Accelerometer.getPermissionsAsync() returned:', { granted, status });
      setPermissionGranted(granted);
      if (!granted) {
        console.log('Permission not granted, requesting...');
        const { granted: newGranted, status: newStatus } = await Accelerometer.requestPermissionsAsync();
        console.log('Accelerometer.requestPermissionsAsync() returned:', { granted: newGranted, status: newStatus });
        setPermissionGranted(newGranted);
      } else {
        console.log('Permission already granted');
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setPermissionGranted(false);
    }
  };

  const _subscribe = () => {
    console.log('Setting up Accelerometer listener with full step detection...');
    const sub = Accelerometer.addListener((accelerometerData) => {
      if (!accelerometerData) {
        console.log('ERROR: Received null/undefined accelerometerData');
        return;
      }
      setListenerCallCount(prev => prev + 1); // Track listener calls

      try {
        const { x, y, z } = accelerometerData;
        if (x === undefined || y === undefined || z === undefined) {
          console.log('Incomplete Accelerometer data');
          return;
        }

        // Accelerometer already provides linear acceleration (gravity removed)
        const linearX = x;
        const linearY = y;
        const linearZ = z;

        const magnitude = Math.sqrt(
          linearX * linearX + linearY * linearY + linearZ * linearZ,
        );

        // Short-term baseline to reduce false positives from gentle movements
        if (magnitudeEmaRef.current === 0) {
          magnitudeEmaRef.current = magnitude;
        } else {
          magnitudeEmaRef.current =
            EMA_ALPHA * magnitude + (1 - EMA_ALPHA) * magnitudeEmaRef.current;
        }

        const deltaFromBaseline = magnitude - magnitudeEmaRef.current;
        const dominantAxis = Math.max(
          Math.abs(linearX),
          Math.abs(linearY),
          Math.abs(linearZ),
        );
        const dominance = magnitude > 0 ? dominantAxis / magnitude : 0;

        // Debug info
        setDebugInfo(prev => ({
          ...prev,
          magnitude: parseFloat(magnitude.toFixed(2)),
          delta: parseFloat(deltaFromBaseline.toFixed(2)),
          baseline: parseFloat(magnitudeEmaRef.current.toFixed(2))
        }));

        // Advanced step detection from working version
        const now = Date.now();
        const rising = magnitude > prevMagnitudeRef.current;

        const highHit =
          magnitude > STEP_THRESHOLD &&
          deltaFromBaseline > PEAK_DELTA &&
          dominance > DOMINANCE_RATIO &&
          rising;

        // Comprehensive logging for debugging
        console.log(`DEBUG: Time=${now}ms, SinceLastHighHit=${lastStepRef.current ? (now - lastStepRef.current) + 'ms' : 'N/A'}, LinearMag=${magnitude.toFixed(2)}, Delta=${deltaFromBaseline.toFixed(2)}, Dom=${dominance.toFixed(2)}, Rising=${rising}, HighHit=${highHit}, InPeak=${inPeakRef.current}, GaitLocked=${gaitLockedRef.current}, BufferSize=${cadenceBufferRef.current.length}, Steps=${stepCount}`);

        if (!inPeakRef.current && highHit) {
          const sinceLast = now - lastStepRef.current;
          console.log(`HIGH_HIT: SinceLast=${sinceLast}ms, MinInterval=${MIN_STEP_INTERVAL}ms`);
          if (sinceLast <= MIN_STEP_INTERVAL) {
            console.log(`INTERVAL_TOO_SHORT: ${sinceLast}ms <= ${MIN_STEP_INTERVAL}ms, skipping`);
            return;
          }
          if (!gaitLockedRef.current) {
            const buf = cadenceBufferRef.current;
            buf.push(now);
            if (buf.length > LOCK_BUFFER_SIZE) buf.shift();
              if (buf.length >= LOCK_BUFFER_SIZE) { // Check for enough peaks to calculate cadence
                const intervals: number[] = [];
                for (let i = 1; i < buf.length; i++) {
                  intervals.push(buf[i] - buf[i - 1]); // Calculate intervals between peaks
                }
                const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
                const minInt = Math.min(...intervals);
                const maxInt = Math.max(...intervals);
                const spread = maxInt - minInt;

                const cadenceOk = (
                  avgInterval >= CADENCE_MIN &&
                  avgInterval <= CADENCE_MAX &&
                  spread <= CADENCE_JITTER
                );
              if (cadenceOk) {
                gaitLockedRef.current = true;
                console.log(`GAIT_LOCKED: Walking pattern detected (avg_interval: ${avgInterval.toFixed(0)}ms, spread: ${spread.toFixed(0)}ms)`);
              }
            }
            lastStepRef.current = now;
            inPeakRef.current = true;
            } else {
                const cadenceOk = sinceLast >= CADENCE_MIN && sinceLast <= CADENCE_MAX;
                console.log(`CADENCE_CHECK: ${sinceLast}ms, Min=${CADENCE_MIN}, Max=${CADENCE_MAX}, OK=${cadenceOk}`);
                if (cadenceOk) {
                  lastStepRef.current = now;
                  setStepCount((prev) => prev + 1);
                  inPeakRef.current = true;
                  console.log(`STEP_COUNTED! Steps: ${stepCount + 1}`);
                } else if (sinceLast > CADENCE_MAX) {
                  console.log(`CADENCE_BREAK: Too slow, unlocking gait`);
                  gaitLockedRef.current = false;
                  cadenceBufferRef.current = [now];
                  lastStepRef.current = now;
                  inPeakRef.current = true;
                } else {
                  console.log(`CADENCE_TOO_FAST: Waiting for next peak`);
                }
              }
          }

        if (inPeakRef.current && magnitude < STEP_THRESHOLD * RESET_RATIO) {
          console.log(`PEAK_RESET: Mag=${magnitude.toFixed(2)} < ${(STEP_THRESHOLD * RESET_RATIO).toFixed(2)}`);
          inPeakRef.current = false;
        }

        // Reset idle timeout and set new one
        if (idleTimeoutRef.current) {
          clearTimeout(idleTimeoutRef.current);
        }
        idleTimeoutRef.current = setTimeout(() => {
          if (gaitLockedRef.current) {
            gaitLockedRef.current = false;
            console.log('GAIT_UNLOCKED: Idle timeout - no peaks detected');
          }
          cadenceBufferRef.current = [];
          inPeakRef.current = false;
        }, RESET_TIMEOUT);

        prevMagnitudeRef.current = magnitude;
      } catch (error) {
        console.warn('Error processing Accelerometer data:', error);
        stopStepCounter();
      }
    });
    setSubscription(sub);
    console.log('Subscription set:', sub ? 'SUCCESS' : 'FAILED');
  };

  const _unsubscribe = () => {
    console.log('Unsubscribing from Accelerometer...');
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  const startStepCounter = async () => {
    if (!isAvailable || !permissionGranted) {
      Alert.alert('Cannot Start', 'Accelerometer is not available or permission not granted.');
      return;
    }

    try {
      // Reset counters
      setStepCount(0);
      setListenerCallCount(0);

      console.log('=== STEP COUNTER SESSION START ===');
      console.log(`PARAMETERS: StepThreshold=${STEP_THRESHOLD}, PeakDelta=${PEAK_DELTA}, DominanceRatio=${DOMINANCE_RATIO}, CadenceMin=${CADENCE_MIN}ms, CadenceMax=${CADENCE_MAX}ms, LockBufferSize=${LOCK_BUFFER_SIZE}, MinStepInterval=${MIN_STEP_INTERVAL}ms`);
      console.log('Starting Accelerometer using Expo docs pattern...');

      // Use the exact pattern from Expo documentation
      _subscribe();

      // Check if listener works after 5 seconds
      setTimeout(() => {
        setListenerCallCount(currentCount => {
          if (currentCount === 0) {
            console.log('WARNING: Accelerometer listener never called after 5 seconds!');
            Alert.alert('Sensor Issue', 'Accelerometer sensor is not providing data. Try shaking your phone to test.');
          } else {
            console.log(`Accelerometer listener called ${currentCount} times in first 5 seconds`);
          }
          return currentCount;
        });
      }, 5000);

      setIsActive(true);
    } catch (error) {
      console.error('Error starting step counter:', error);
      Alert.alert('Error', 'Failed to start step counter. Please try again.');
    }
  };

  const stopStepCounter = () => {
    console.log(`=== STEP COUNTER SESSION END === Final Steps: ${stepCount}, Total Listener Calls: ${listenerCallCount}`);
    try {
      _unsubscribe();
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping step counter:', error);
    }
    setIsActive(false);
    setListenerCallCount(0);
    lastStepRef.current = 0;
    magnitudeEmaRef.current = 0;
    prevMagnitudeRef.current = 0;
    inPeakRef.current = false;
    gaitLockedRef.current = false;
    cadenceBufferRef.current = [];
  };

  const resetCounter = () => {
    setStepCount(0);
    setListenerCallCount(0);
    lastStepRef.current = 0;
    magnitudeEmaRef.current = 0;
    prevMagnitudeRef.current = 0;
    inPeakRef.current = false;
    gaitLockedRef.current = false;
    cadenceBufferRef.current = [];
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  };

  const testSensors = async () => {
    console.log('=== TESTING ALL SENSORS ===');

    // Test Accelerometer
    try {
      console.log('Testing Accelerometer...');
      const accelAvailable = await Accelerometer.isAvailableAsync();
      console.log('Accelerometer available:', accelAvailable);

      if (accelAvailable) {
        let accelCount = 0;
        const accelSub = Accelerometer.addListener((data) => {
          accelCount++;
          console.log(`Accelerometer data #${accelCount}:`, data);
          if (accelCount >= 3) {
            accelSub.remove();
            console.log('Accelerometer test complete');
          }
        });
        Accelerometer.setUpdateInterval(500);

        setTimeout(() => {
          if (accelCount === 0) {
            console.log('Accelerometer FAILED - no data received');
          }
          accelSub.remove();
        }, 3000);
      }
    } catch (error) {
      console.error('Accelerometer test error:', error);
    }


    setDebugInfo(prev => ({ ...prev, sensorTest: 'testing...' }));
    setTimeout(() => {
      setDebugInfo(prev => ({ ...prev, sensorTest: 'complete - check console' }));
    }, 4000);
  };

  return (
    <View className={`items-center justify-center p-6 bg-white rounded-lg shadow-md ${className}`}>
      <Text weight="bold" className="text-2xl text-gray-800 mb-4">Step Counter</Text>

      {/* Status Information */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600">
          Device Motion Available: {isAvailable === null ? 'Checking...' : isAvailable ? 'Yes' : 'No'}
        </Text>
        <Text className="text-sm text-gray-600">
          Permission: {permissionGranted === null ? 'Checking...' : permissionGranted ? 'Granted' : 'Denied'}
        </Text>
        {(isActive || debugInfo.sensorTest !== 'none') && (
          <View className="mt-2 p-2 bg-gray-100 rounded">
            <Text className="text-xs text-gray-800">
              Magnitude: {debugInfo.magnitude} | Baseline: {debugInfo.baseline}
            </Text>
            <Text className="text-xs text-gray-800">
              Delta: {debugInfo.delta} | Threshold: {STEP_THRESHOLD} | Peak Delta: {PEAK_DELTA}
            </Text>
            {isActive && (
              <View>
                <Text className="text-xs text-green-600">
                  Listener Calls: {listenerCallCount}
                </Text>
                <Text className="text-xs text-blue-600">
                  Gait: {gaitLockedRef.current ? 'Locked' : 'Unlocked'}
                </Text>
              </View>
            )}
            {debugInfo.sensorTest !== 'none' && (
              <Text weight="semiBold" className="text-xs text-blue-600">
                Sensor Test: {debugInfo.sensorTest}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Step Count Display */}
      <View className="bg-blue-100 rounded-full w-32 h-32 items-center justify-center mb-6">
        <Text weight="bold" className="text-4xl text-blue-600">{stepCount}</Text>
        <Text className="text-sm text-blue-500">steps</Text>
      </View>

      {/* Controls */}
      <View className="flex-row space-x-4 mb-4">
        {!isActive ? (
          <TouchableOpacity
            onPress={startStepCounter}
            className="bg-green-500 px-6 py-3 rounded-lg"
            disabled={!isAvailable || !permissionGranted}
          >
            <Text weight="semiBold" className="text-white">Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={stopStepCounter}
            className="bg-red-500 px-6 py-3 rounded-lg"
          >
            <Text weight="semiBold" className="text-white">Stop</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={resetCounter}
          className="bg-gray-500 px-6 py-3 rounded-lg"
        >
          <Text weight="semiBold" className="text-white">Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Sensor Test */}
      <TouchableOpacity
        onPress={testSensors}
        className="bg-blue-500 px-6 py-3 rounded-lg mb-4"
      >
        <Text weight="semiBold" className="text-white">Test All Sensors</Text>
      </TouchableOpacity>

      {/* Instructions */}
      <Text className="text-xs text-gray-500 mt-4 text-center px-4">
        Place your phone in your pocket or hold it while walking to count steps.
      </Text>
      <Text className="text-xs text-orange-600 mt-2 text-center px-4">
        🔧 If sensors don't work: Tap "Test All Sensors" and check console logs.
      </Text>
    </View>
  );
};