import React from 'react';
import { Stack } from 'expo-router';

// Stack layout for nested myaccount routes
export default function MyAccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
      }}
    />
  );
}

