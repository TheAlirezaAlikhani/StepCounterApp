import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './ui/Text';

interface MenuItemProps {
  icon: string;
  title: string;
  onPress?: () => void;
  showChevron?: boolean;
}

export function MenuItem({ icon, title, onPress, showChevron = true }: MenuItemProps) {
  return (
    <Pressable
      className="flex-row items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-700 active:bg-slate-100 dark:active:bg-slate-700/50"
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.05)' }}
    >
      <View className="flex-row items-center gap-4">
        <View className="w-9 h-9 rounded-xl bg-primary/10 items-center justify-center">
          <Ionicons name={icon as any} size={24} color="#8B5CF6" />
        </View>
        <Text weight="medium" className="text-sm text-gray-900 dark:text-white">
          {title}
        </Text>
      </View>
      {showChevron && (
        <Ionicons name="chevron-back" size={24} color="#9CA3AF" />
      )}
    </Pressable>
  );
}
