import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/theme-context';

// Main layout - With SafeAreaView for regular app screens
export default function MainLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className={theme === 'dark' ? 'dark' : ''}
      style={{
        flex: 1,
        backgroundColor: theme === 'dark' ? '#18181B' : '#F8FAFC'
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaView>
  );
}

