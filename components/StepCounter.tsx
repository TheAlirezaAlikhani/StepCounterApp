import React, { useState, useEffect, useMemo } from 'react';
import { Pressable, View, NativeModules, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui/Text';

// 🔹 Get native module
const { StepCounter: StepCounterModule } = NativeModules;

// Constants from Next.js version
const STEP_GOAL = 8000;
const CALORIE_GOAL = 320;
const STRIDE_METERS = 0.75; // متوسط طول گام (متر)
const WEIGHT_KG = 70; // وزن مفروض برای محاسبه کالری
const KCAL_PER_KG_PER_KM = 0.57; // هزینه انرژی پیاده‌روی در هر کیلومتر به ازای هر کیلوگرم

export const StepCounter: React.FC = () => {
  const [stepCount, setStepCount] = useState(0);
  const [isServiceRunning, setIsServiceRunning] = useState(false);

  // Calculations matching Next.js version
  const distanceKm = useMemo(
    () => Math.max(0, +(stepCount * (STRIDE_METERS / 1000)).toFixed(2)),
    [stepCount],
  );

  const calories = useMemo(
    () =>
      Math.max(
        0,
        +(
          distanceKm *
          WEIGHT_KG *
          KCAL_PER_KG_PER_KM
        ).toFixed(1),
      ),
    [distanceKm],
  );

  const stepProgress = useMemo(
    () => Math.min(100, Math.round((stepCount / STEP_GOAL) * 100)),
    [stepCount],
  );

  const calorieProgress = useMemo(
    () => Math.min(100, Math.round((calories / CALORIE_GOAL) * 100)),
    [calories],
  );

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
    <View className="relative mb-5">
      {/* Grid Layout - 2 columns */}
      <View className="flex-row gap-3 mb-5">
        {/* Steps Card */}
        <View className="flex-1 relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-800 p-4 shadow-lg">
          <View className="absolute inset-y-0 right-0 w-1 bg-primary" />
          <View className="flex-row items-start justify-between">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Ionicons name="footsteps" size={20} color="#8B5CF6" />
            </View>
            <View className="rounded-full bg-primary/10 px-2 py-0.5">
              <Text weight="bold" className="text-xs text-primary">
                {stepProgress.toLocaleString("fa-IR")}%
              </Text>
            </View>
          </View>
          <View className="mt-2 space-y-1">
            <Text weight="black" className="text-3xl text-gray-900 dark:text-white leading-tight flex-row items-center">
              <Text>{stepCount.toLocaleString("fa-IR")}</Text>
              <Text weight="semiBold" className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                / {STEP_GOAL.toLocaleString("fa-IR")}
              </Text>
            </Text>
            <Text weight="medium" className="text-xs text-gray-400">قدم‌های امروز</Text>
          </View>
          <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-700">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${stepProgress}%` }}
            />
          </View>
        </View>

        {/* Calories Card */}
        <View className="flex-1 relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-800 p-4 shadow-lg">
          <View className="absolute inset-y-0 right-0 w-1 bg-orange-500" />
          <View className="flex-row items-start justify-between">
            <View className="h-9 w-9 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20">
              <Ionicons name="flame" size={20} color="#EA580C" />
            </View>
            <View className="rounded-full bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5">
              <Text weight="bold" className="text-xs text-orange-600 dark:text-orange-400">
                {calorieProgress.toLocaleString("fa-IR")}%
              </Text>
            </View>
          </View>
          <View className="mt-2 space-y-1">
            <Text weight="black" className="text-3xl text-gray-900 dark:text-white leading-tight flex-row items-center">
              <Text>{calories.toLocaleString("fa-IR")}</Text>
              <Text weight="semiBold" className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                / {CALORIE_GOAL.toLocaleString("fa-IR")}
              </Text>
            </Text>
            <Text weight="medium" className="text-xs text-gray-400">کالری سوزانده شده (kcal)</Text>
          </View>
          <View className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-zinc-700">
            <View
              className="h-full rounded-full bg-orange-500"
              style={{ width: `${calorieProgress}%` }}
            />
          </View>
        </View>
      </View>

     

      {/* Service Status */}
      <View className="mb-4 items-center">
        <Text className={`text-sm ${isServiceRunning ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}`}>
          سرویس: {isServiceRunning ? 'در حال اجرا' : 'متوقف شده'}
        </Text>
      </View>

      {/* Control Buttons */}
      <View className="gap-3">
        {!isServiceRunning ? (
          <Pressable
            className="bg-green-500 py-3 px-4 rounded-lg items-center active:bg-green-600"
            onPress={startService}
          >
            <Text weight="semiBold" className="text-white text-base">شروع سرویس پس‌زمینه شمارنده قدم</Text>
          </Pressable>
        ) : (
          <Pressable
            className="bg-red-500 py-3 px-4 rounded-lg items-center active:bg-red-600"
            onPress={stopService}
          >
            <Text weight="semiBold" className="text-white text-base">توقف سرویس پس‌زمینه شمارنده قدم</Text>
          </Pressable>
        )}

        {/* <Pressable
          className="bg-gray-500 py-3 px-4 rounded-lg items-center active:bg-gray-600"
          onPress={resetStepCount}
        >
          <Text weight="semiBold" className="text-white text-base">بازنشانی شمارنده قدم</Text>
        </Pressable>

        <Pressable
          className="bg-blue-500 py-3 px-4 rounded-lg items-center active:bg-blue-600"
          onPress={fetchStepCount}
        >
          <Text weight="semiBold" className="text-white text-base">به‌روزرسانی شمارنده قدم</Text>
        </Pressable> */}
      </View>
    </View>
  );
};
