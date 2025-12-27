import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks/theme-context';
import { CustomTabBar } from '../../components/CustomTabBar';

// Main layout - Tabs navigation with custom animated tab bar
export default function MainLayout() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: 'transparent', // Transparent safe area
      }}
    >
      <View
        className={theme === 'dark' ? 'dark' : ''}
        style={{
          flex: 1,
          backgroundColor: isDark ? '#18181B' : '#F8FAFC',
          paddingBottom: 30,
        }}
      >
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            animation: 'shift',
          }}
        >
        <Tabs.Screen name="myaccount" />
        <Tabs.Screen name="index" />
        <Tabs.Screen name="courses-list" />
        {/* Hide nested routes from tab bar */}
        <Tabs.Screen
          name="myaccount/profile-edit"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="myaccount/active-courses"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="myaccount/payment-history"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="faq"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="contact-us"
          options={{
            href: null,
          }}
        />
      </Tabs>
      </View>
    </SafeAreaView>
  );
}

