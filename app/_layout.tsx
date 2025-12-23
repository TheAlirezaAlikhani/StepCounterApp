import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../hooks/theme-context';

import '../global.css';

function RootLayout() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      className={theme === 'dark' ? 'dark' : ''}
      style={{
        flex: 1,
        backgroundColor: theme === 'dark' ? '#18181B' : '#F8FAFC'
      }}
    >
      <Slot />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayout />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}


