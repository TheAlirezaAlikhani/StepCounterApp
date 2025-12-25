import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/theme-context';

// Auth layout - NO SafeAreaView for full-screen experience (signup, login, etc.)
export default function AuthLayout() {
  const { theme } = useTheme();

  return (
    <View
      className={theme === 'dark' ? 'dark' : ''}
      style={{
        flex: 1,
        backgroundColor: '#000000' // Black background for image screens
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}

