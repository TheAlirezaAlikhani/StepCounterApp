import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/theme-context';

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
  const { theme } = useTheme();

  return (
    <View className={` ps-14 pe-3 flex flex-row-reverse items-center justify-between w-full rounded-full border-0 bg-gray-100 dark:bg-zinc-800 py-3  text-md text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary mb-5 ${className || ''}`}>
      <TextInput
        className="w-full  flex rounded-full bg-gray-100 dark:bg-zinc-800  text-md text-gray-800 dark:text-gray-200 "
        placeholder={placeholder}
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={value}
        onChangeText={onChangeText}
        style={{
          textAlign: 'right',
          writingDirection: 'rtl',
        }}
      />
      <View className="flex items-center justify-center">
        <Ionicons
          name="search"
          size={28}
          color={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        />
      </View>
    </View>
  );
}
