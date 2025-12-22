import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = "جستجو در دوره‌ها و برنامه‌ها...",
  value,
  onChangeText,
  className,
}: SearchInputProps) {
  return (
    <View className={`relative mb-3 ${className || ''}`}>
      <View className="absolute top-1/2 right-6 -translate-y-1/2">
        <Ionicons name="search" size={20} color="#9ca3af" />
      </View>
      <TextInput
        className="w-full rounded-full border-0 bg-gray-100 dark:bg-zinc-800 py-5 pl-6 pr-16 text-md text-gray-800 dark:text-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        style={{
          textAlign: 'right',
          writingDirection: 'rtl',
        }}
      />
    </View>
  );
}
