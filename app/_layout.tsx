import '../global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../hooks/theme-context';
import { Stack } from 'expo-router';

// Root layout - No SafeAreaView here, let each group handle it
export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
