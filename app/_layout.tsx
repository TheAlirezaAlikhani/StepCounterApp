import '../global.css';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../hooks/theme-context';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { SessionProvider, useSession } from '../context/ctx';

// Prevent the splash screen from auto-hiding before fonts/auth are loaded
SplashScreen.preventAutoHideAsync();

// Root layout component
export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    'Estedad-Black': require('../assets/fonts/Estedad-Black.otf'),
    'Estedad-ExtraBold': require('../assets/fonts/Estedad-ExtraBold.otf'),
    'Estedad-Bold': require('../assets/fonts/Estedad-Bold.otf'),
    'Estedad-SemiBold': require('../assets/fonts/Estedad-SemiBold.otf'),
    'Estedad-Medium': require('../assets/fonts/Estedad-Medium.otf'),
    'Estedad-Regular': require('../assets/fonts/Estedad-Regular.otf'),
    'Estedad-Light': require('../assets/fonts/Estedad-Light.otf'),
    'Estedad-ExtraLight': require('../assets/fonts/Estedad-ExtraLight.otf'),
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SessionProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootNavigator fontsLoaded={fontsLoaded} fontError={fontError} />
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </SessionProvider>
  );
}

// Separate component to access SessionProvider context
function RootNavigator({
  fontsLoaded,
  fontError,
}: {
  fontsLoaded: boolean;
  fontError: Error | null;
}) {
  const { session, isLoading } = useSession();

  const onLayoutRootView = useCallback(async () => {
    // Hide splash screen when both fonts and auth are loaded
    if ((fontsLoaded || fontError) && !isLoading) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, isLoading]);

  // Keep splash screen visible while loading
  if (isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade',
            }}
      >
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(main)" />
        </Stack.Protected>

        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </View>
  );
}
