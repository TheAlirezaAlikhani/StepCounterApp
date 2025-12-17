import React, { useState, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Alert } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

interface StepCounterProps {
  className?: string;
}

export const StepCounter: React.FC<StepCounterProps> = ({ className }) => {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  // Step detection variables
  const lastMagnitudeRef = useRef(0);
  const filteredMagnitudeRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const subscriptionRef = useRef<any>(null);

  // Step detection parameters
  const STEP_THRESHOLD = 11.5; // Adjust based on testing
  const MIN_STEP_INTERVAL = 300; // Minimum time between steps in ms
  const FILTER_ALPHA = 0.1; // Low-pass filter coefficient (0-1, lower = more smoothing)

  useEffect(() => {
    checkAvailability();
    checkPermissions();
  }, []);

  const checkAvailability = async () => {
    const available = await DeviceMotion.isAvailableAsync();
    setIsAvailable(available);
    if (!available) {
      Alert.alert('Device Motion Not Available', 'Your device does not support motion sensors.');
    }
  };

  const checkPermissions = async () => {
    const { granted } = await DeviceMotion.getPermissionsAsync();
    setPermissionGranted(granted);
    if (!granted) {
      const { granted: newGranted } = await DeviceMotion.requestPermissionsAsync();
      setPermissionGranted(newGranted);
    }
  };

  const startStepCounter = async () => {
    if (!isAvailable || !permissionGranted) {
      Alert.alert('Cannot Start', 'Device motion is not available or permission not granted.');
      return;
    }

    // Reset counters
    setStepCount(0);
    lastMagnitudeRef.current = 0;
    filteredMagnitudeRef.current = 0;
    lastStepTimeRef.current = 0;

    // Set update interval (50ms = 20Hz)
    DeviceMotion.setUpdateInterval(50);

    // Subscribe to motion updates
    subscriptionRef.current = DeviceMotion.addListener((motionData) => {
      if (motionData.accelerationIncludingGravity) {
        const { x, y, z } = motionData.accelerationIncludingGravity;
        const magnitude = Math.sqrt(x * x + y * y + z * z);

        // Apply low-pass filter
        filteredMagnitudeRef.current =
          FILTER_ALPHA * magnitude + (1 - FILTER_ALPHA) * filteredMagnitudeRef.current;

        // Detect step
        const now = Date.now();
        if (
          filteredMagnitudeRef.current > STEP_THRESHOLD &&
          lastMagnitudeRef.current <= STEP_THRESHOLD &&
          now - lastStepTimeRef.current > MIN_STEP_INTERVAL
        ) {
          setStepCount(prev => prev + 1);
          lastStepTimeRef.current = now;
        }

        lastMagnitudeRef.current = filteredMagnitudeRef.current;
      }
    });

    setIsActive(true);
  };

  const stopStepCounter = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setIsActive(false);
  };

  const resetCounter = () => {
    setStepCount(0);
    lastStepTimeRef.current = 0;
  };

  return (
    <View className={`items-center justify-center p-6 bg-white rounded-lg shadow-md ${className}`}>
      <Text className="text-2xl font-bold text-gray-800 mb-4">Step Counter</Text>

      {/* Status Information */}
      <View className="mb-4">
        <Text className="text-sm text-gray-600">
          Available: {isAvailable === null ? 'Checking...' : isAvailable ? 'Yes' : 'No'}
        </Text>
        <Text className="text-sm text-gray-600">
          Permission: {permissionGranted === null ? 'Checking...' : permissionGranted ? 'Granted' : 'Denied'}
        </Text>
      </View>

      {/* Step Count Display */}
      <View className="bg-blue-100 rounded-full w-32 h-32 items-center justify-center mb-6">
        <Text className="text-4xl font-bold text-blue-600">{stepCount}</Text>
        <Text className="text-sm text-blue-500">steps</Text>
      </View>

      {/* Controls */}
      <View className="flex-row space-x-4">
        {!isActive ? (
          <TouchableOpacity
            onPress={startStepCounter}
            className="bg-green-500 px-6 py-3 rounded-lg"
            disabled={!isAvailable || !permissionGranted}
          >
            <Text className="text-white font-semibold">Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={stopStepCounter}
            className="bg-red-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Stop</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={resetCounter}
          className="bg-gray-500 px-6 py-3 rounded-lg"
        >
          <Text className="text-white font-semibold">Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <Text className="text-xs text-gray-500 mt-4 text-center px-4">
        Place your phone in your pocket or hold it while walking to count steps.
      </Text>
    </View>
  );
};