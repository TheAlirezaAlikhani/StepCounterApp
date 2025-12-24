import '../global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../hooks/theme-context';
import { Stack } from 'expo-router';


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
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="myaccount" />
        <Stack.Screen name="courses-list" />
      </Stack>
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


