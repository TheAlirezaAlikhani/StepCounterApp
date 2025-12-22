import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TipCardProps {
  id: number;
  title: string;
  readingTime: string;
  image: string;
  onPress?: () => void;
}

export function TipCard({
  id,
  title,
  readingTime,
  image,
  onPress,
}: TipCardProps) {
  return (
    <Pressable
      className="w-full"
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <View className="flex-row items-center w-full gap-4 bg-gray-100 dark:bg-zinc-800/50 rounded-2xl p-4">
        <Image
          source={{ uri: image }}
          className="h-20 w-20 shrink-0 rounded-xl"
          resizeMode="cover"
        />
        <View className="flex-1 min-w-0">
          <Text
            className="text-base font-semibold text-gray-800 dark:text-gray-200"
            numberOfLines={2}
          >
            {title}
          </Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="time-outline" size={14} color="#6b7280" />
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {readingTime}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
