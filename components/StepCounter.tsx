import React, { useState, useEffect } from 'react';
import { Pressable, View, NativeModules, Text, Alert } from 'react-native';

// 🔹 Get native module
const { StepCounter: StepCounterModule } = NativeModules;

export const StepCounter: React.FC = () => {
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
      const count = await StepCounterModule.getStepCount();
      setStepCount(count);
    } catch (error) {
      console.error('Error fetching step count:', error);
    }
  };

  const startService = () => {
    console.log('Starting service');
    try {
      StepCounterModule.startService();
      setIsServiceRunning(true);
    } catch (error) {
      console.error('Error starting service:', error);
      Alert.alert('Error', 'Failed to start step counter service');
    }
  };

  const stopService = () => {
    console.log('Stopping service');
    try {
      StepCounterModule.stopService();
      setIsServiceRunning(false);
    } catch (error) {
      console.error('Error stopping service:', error);
      Alert.alert('Error', 'Failed to stop step counter service');
    }
  };

  const resetStepCount = async () => {
    try {
      await StepCounterModule.resetStepCount();
      setStepCount(0);
      Alert.alert('Reset', 'Step count has been reset to 0');
    } catch (error) {
      console.error('Error resetting step count:', error);
      Alert.alert('Error', 'Failed to reset step count');
    }
  };

  return (
    <View className="bg-gray-100 dark:bg-zinc-800/50 rounded-2xl p-6">
      {/* Step Counter Display */}
      <View className="items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          شمارنده قدم
        </Text>

        <View className="bg-blue-500 rounded-full w-32 h-32 items-center justify-center mb-4">
          <Text className="text-4xl font-bold text-white">
            {stepCount.toLocaleString('fa-IR')}
          </Text>
          <Text className="text-base text-blue-100">
            قدم
          </Text>
        </View>

        <Text className={`text-sm mb-4 ${isServiceRunning ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
          سرویس: {isServiceRunning ? 'در حال اجرا' : 'متوقف شده'}
        </Text>
      </View>

      {/* Buttons */}
      <View className="gap-3">
        {!isServiceRunning ? (
          <Pressable
            className="bg-green-500 py-3 px-4 rounded-lg items-center active:bg-green-600"
            onPress={startService}
          >
            <Text className="text-white font-semibold text-base">شروع سرویس پس‌زمینه شمارنده قدم</Text>
          </Pressable>
        ) : (
          <Pressable
            className="bg-red-500 py-3 px-4 rounded-lg items-center active:bg-red-600"
            onPress={stopService}
          >
            <Text className="text-white font-semibold text-base">توقف سرویس پس‌زمینه شمارنده قدم</Text>
          </Pressable>
        )}

        <Pressable
          className="bg-gray-500 py-3 px-4 rounded-lg items-center active:bg-gray-600"
          onPress={resetStepCount}
        >
          <Text className="text-white font-semibold text-base">بازنشانی شمارنده قدم</Text>
        </Pressable>

        <Pressable
          className="bg-blue-500 py-3 px-4 rounded-lg items-center active:bg-blue-600"
          onPress={fetchStepCount}
        >
          <Text className="text-white font-semibold text-base">به‌روزرسانی شمارنده قدم</Text>
        </Pressable>
      </View>

      <View className="mt-4">
        <Text className="text-xs text-gray-500 dark:text-gray-400 text-center leading-5">
          تلفن خود را در جیب قرار دهید یا هنگام راه رفتن در دست نگه دارید.{'\n'}
          شمارنده قدم حتی وقتی صفحه نمایش خاموش است در پس‌زمینه اجرا می‌شود.
        </Text>
      </View>
    </View>
  );
};
