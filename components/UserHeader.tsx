import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface User {
  display_name?: string;
  first_name?: string;
  acf?: {
    profile_image?: {
      thumb?: string;
      medium?: string;
    };
  };
}

interface UserHeaderProps {
  user?: User;
  isLoading?: boolean;
  onNotificationPress?: () => void;
  onToggleTheme?: () => void;
  onAccountPress?: () => void;
}

export function UserHeader({ user, isLoading = false, onNotificationPress, onToggleTheme, onAccountPress }: UserHeaderProps) {
  const displayName = user?.display_name || user?.first_name || "کاربر جدید";

  return (
    <View className="mb-6 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <View className="h-12 w-12 rounded-full bg-primary/10 items-center justify-center overflow-hidden">
          {user?.acf?.profile_image?.thumb || user?.acf?.profile_image?.medium ? (
            <Image
              source={{ uri: user.acf.profile_image.thumb || user.acf.profile_image.medium }}
              className="h-12 w-12 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-primary text-base font-semibold">
              {isLoading ? "..." : displayName.charAt(0)}
            </Text>
          )}
        </View>
        <View>
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            امروز چطوری؟
          </Text>
          <Text className="text-xl font-bold text-gray-900 dark:text-white truncate">
            {isLoading ? "..." : displayName}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-2">
        {onAccountPress && (
          <Pressable
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
            onPress={onAccountPress}
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
          >
            <Ionicons name="person" size={20} color="#4b5563" />
          </Pressable>
        )}

        {/* {onToggleTheme && (
          <Pressable
            className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
            onPress={onToggleTheme}
            android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
          >
            <Ionicons name="moon-outline" size={20} color="#4b5563" />
          </Pressable>
        )} */}

<Pressable
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
          onPress={() => {
            // Use expo-router or react-navigation to navigate to the myaccount page
            // Best practice: useLink for expo-router, useNavigation for react-navigation
            // Here we use dynamic import for expo-router's router for code splitting
            import('expo-router').then(({ useRouter }) => {
              router.push('/signup');
            });
          }}>
          <Ionicons name="person-outline" size={20} color="#4b5563" />
        </Pressable>

        <Pressable
          className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700"
          onPress={onNotificationPress}
          android_ripple={{ color: 'rgba(0,0,0,0.1)', borderless: true }}
        >
          <Ionicons name="notifications-outline" size={20} color="#4b5563" />
        </Pressable>
      </View>
    </View>
  );
}
