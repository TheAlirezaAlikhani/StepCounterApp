import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuggestedCourseCardProps {
  id: number;
  title: string;
  duration: string;
  image: string;
  onPress?: () => void;
}

export function SuggestedCourseCard({
  id,
  title,
  duration,
  image,
  onPress,
}: SuggestedCourseCardProps) {
  return (
    <Pressable
      className="shrink-0 w-64 ml-4"
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <View className="relative overflow-hidden rounded-2xl bg-gray-200">
        <Image
          source={{ uri: image }}
          className="h-44 w-full"
          resizeMode="cover"
          onError={() => console.log('Image failed to load:', image)}
        />
        <View className="absolute inset-0 bg-black/50" />
        <View className="absolute bottom-0 p-4">
          <Text className="text-base font-semibold text-white mb-1" numberOfLines={2}>
            {title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} color="#d1d5db" />
            <Text className="text-sm text-gray-300">{duration}</Text>
          </View>
        </View>
        <View className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
          <Ionicons name="chevron-back" size={16} color="#ffffff" />
        </View>
      </View>
    </Pressable>
  );
}
