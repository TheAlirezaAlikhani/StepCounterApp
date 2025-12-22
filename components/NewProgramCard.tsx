import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NewProgramCardProps {
  title?: string;
  description?: string;
  duration?: string;
  details?: string;
  image?: string;
  imageAlt?: string;
  onStart?: () => void;
}

export function NewProgramCard({
  title = "برنامه جدید شما",
  description = "با پیاده‌روی در خانه فعال بمانید!",
  duration = "۲۰ دقیقه",
  details = "به سلامت قلب و سوزاندن کالری کمک کنید.",
  image = "/thumbnail.png",
  imageAlt = "Woman doing a yoga pose",
  onStart,
}: NewProgramCardProps) {
  return (
    <View className="relative mb-8 rounded-2xl bg-gray-100 dark:bg-zinc-800/50 border-0 overflow-hidden">
      <View className="relative">
        <Image
          source={require('../assets/splash.png')}
          className="w-full h-40"
          resizeMode="cover"
        />
        <View className="absolute top-3 right-3">
          <View className="flex-row items-center gap-1 rounded-full bg-white px-3 py-1.5">
            <Ionicons name="time-outline" size={14} color="#4b5563" />
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {duration}
            </Text>
          </View>
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row items-start gap-4 mb-1">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {description}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {details}
        </Text>
      </View>
      <Pressable
        className="absolute bottom-4 left-4 bg-primary rounded-full p-2.5 active:bg-primary/80"
        onPress={onStart}
        android_ripple={{ color: 'rgba(255,255,255,0.3)', borderless: true }}
      >
        <Ionicons name="chevron-forward" size={16} color="#ffffff" />
      </Pressable>
    </View>
  );
}
