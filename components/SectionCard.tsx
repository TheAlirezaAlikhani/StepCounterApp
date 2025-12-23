import React from 'react';
import { View, Text } from 'react-native';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <View className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4">
      <Text className="text-base font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </Text>
      <View className="space-y-2">
        {children}
      </View>
    </View>
  );
}
