import React from 'react';
import { View } from 'react-native';
import { Text } from './ui/Text';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <View className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4">
      <Text weight="bold" className="text-base text-gray-900 dark:text-white mb-4">
        {title}
      </Text>
      <View className="space-y-2">
        {children}
      </View>
    </View>
  );
}
