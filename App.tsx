import React, { useState, useEffect } from 'react';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Button, View, NativeModules, ScrollView, Text, Alert } from 'react-native';

import './global.css';

// 🔹 Get native module
const { StepCounter } = NativeModules;

export default function App() {
  const [stepCount, setStepCount] = useState(0);
  const [isServiceRunning, setIsServiceRunning] = useState(false);

  // Fetch step count periodically when service is running
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isServiceRunning) {
      // Update immediately
      fetchStepCount();

      // Then update every 300ms for near real-time updates
      interval = setInterval(fetchStepCount, 300);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isServiceRunning]);

  const fetchStepCount = async () => {
    try {
      const count = await StepCounter.getStepCount();
      setStepCount(count);
    } catch (error) {
      console.error('Error fetching step count:', error);
    }
  };

  const startService = () => {
    console.log('Starting service');
    try {
      StepCounter.startService();
      setIsServiceRunning(true);
    } catch (error) {
      console.error('Error starting service:', error);
      Alert.alert('Error', 'Failed to start step counter service');
    }
  };

  const stopService = () => {
    console.log('Stopping service');
    try {
      StepCounter.stopService();
      setIsServiceRunning(false);
    } catch (error) {
      console.error('Error stopping service:', error);
      Alert.alert('Error', 'Failed to stop step counter service');
    }
  };

  const resetStepCount = async () => {
    try {
      await StepCounter.resetStepCount();
      setStepCount(0);
      Alert.alert('Reset', 'Step count has been reset to 0');
    } catch (error) {
      console.error('Error resetting step count:', error);
      Alert.alert('Error', 'Failed to reset step count');
    }
  };

  return (
    <ScrollView>
    <View style={{ flex: 1, marginTop: 60 }}>

      <ScreenContent title="Home" path="App.tsx" />

      {/* Step Counter Display */}
      <View style={{ alignItems: 'center', marginVertical: 40, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          Step Counter
        </Text>

        <View style={{
          backgroundColor: '#3B82F6',
          borderRadius: 75,
          width: 150,
          height: 150,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20
        }}>
          <Text style={{ fontSize: 48, fontWeight: 'bold', color: 'white' }}>
            {stepCount}
          </Text>
          <Text style={{ fontSize: 16, color: '#DBEAFE' }}>
            steps
          </Text>
        </View>

        <Text style={{ fontSize: 14, color: isServiceRunning ? '#10B981' : '#6B7280', marginBottom: 20 }}>
          Service: {isServiceRunning ? 'Running' : 'Stopped'}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        {!isServiceRunning ? (
          <Button
            title="Start Background Step Service"
            onPress={startService}
            color="#10B981"
          />
        ) : (
          <Button
            title="Stop Background Step Service"
            onPress={stopService}
            color="#EF4444"
          />
        )}

        <View style={{ height: 20 }} />

        <Button
          title="Reset Step Count"
          onPress={resetStepCount}
          color="#6B7280"
        />

        <View style={{ height: 20 }} />

        <Button
          title="Refresh Step Count"
          onPress={fetchStepCount}
          color="#3B82F6"
        />
      </View>

      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center' }}>
          Place your phone in your pocket or hold it while walking.{'\n'}
          The step counter runs in the background even when the screen is off.
        </Text>
      </View>

      <StatusBar style="auto" />
    </View>
    </ScrollView>
  );
}