import '../global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../hooks/theme-context';
import { Easing } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { ParamListBase, StackNavigationState } from '@react-navigation/native';
import {
  StackNavigationEventMap,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createStackNavigator();

export const JsStack = withLayoutContext<
  StackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  StackNavigationEventMap
>(Navigator);


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
      <JsStack
        screenOptions={{
          headerShown: false,
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 250,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Material Design easing
              },
            },
            close: {
              animation: 'timing',
              config: {
                duration: 250,
                easing: Easing.bezier(0.4, 0, 0.6, 1),
              },
            },
          },
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            };
          },
        }}
      />
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


