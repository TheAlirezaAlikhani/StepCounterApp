import React from 'react';
import { View, Text, ScrollView, Alert, Pressable, Image } from 'react-native';
import { useTheme } from '../../hooks/theme-context';
// Using Unicode symbols instead of icons

export default function MyAccountScreen() {
  const { theme } = useTheme();

  // Mock user data - replace with actual user data
  const user = {
    display_name: "کاربر نمونه",
    email: "user@example.com",
    acf: {
      profile_image: {
        thumb: "https://via.placeholder.com/80x80"
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "خروج از حساب",
      "آیا مطمئن هستید که می‌خواهید از حساب خود خارج شوید؟",
      [
        { text: "لغو", style: "cancel" },
        {
          text: "خروج",
          style: "destructive",
          onPress: () => {
            // Handle logout logic here
            console.log("User logged out");
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#18181B' : '#f7fafc' }}>
      
        <View className="max-w-md mx-auto flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 py-4">
            {/* User Info */}
            <View className="flex-row items-center gap-4 mb-4 mt-4">
              <View className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                {true ? (
                  <Image
                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_pIIlFzwaCh7zW3LKaHWihfEOCkIZlmy_X5sL0qLOp0jUT2dw5CqvbhQ-aYGWztSdTVP4q4avSsI3RSuHG2OnwZ20kOfs-ZQaShbUh_-5QT8luko66l4X8HH6KdBKAEBz5PtabN9MTVmMlWvET7UHFg8BHjw5k7ROMPp_i6IVPQ2R8MDnrK8opWlgoyHOzhLCV6iUQtEjIMjkPS0btHzv4-ooslBlixWyX-1PXeuGVDEMFPpjvGrBQTd5KWaRU9lpuUTFmya98ds" }}
                    className="w-20 h-20 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-2xl text-slate-500">👤</Text>
                )}
              </View>
              <View>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  {user.display_name || "کاربر"}
                </Text>
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {user.email || "user@example.com"}
                </Text>
              </View>
            </View>

            {/* Account Sections */}
            <View className="gap-4 mt-6">
              {/* User Information Section */}
              <View className="bg-white dark:bg-zinc-700 p-4 rounded-2xl">
                <Text className="font-bold mb-4 text-base" style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827' }}>
                  اطلاعات کاربری
                </Text>
                <View className="space-y-2">
                  <Pressable className="flex-row items-center justify-between p-3 rounded-lg active:bg-slate-100 dark:active:bg-slate-700/50">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-lg">👤</Text>
                      <Text className="font-medium text-sm text-gray-900 dark:text-white">
                        ویرایش پروفایل
                      </Text>
                    </View>
                    <Text className="text-lg">›</Text>
                  </Pressable>

                  <Pressable className="flex-row items-center justify-between p-3 rounded-2xl active:bg-slate-100 dark:active:bg-slate-700/50">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-lg">🔒</Text>
                      <Text className="font-medium text-sm text-gray-900 dark:text-white">
                        تغییر رمز عبور
                      </Text>
                    </View>
                    <Text className="text-lg">›</Text>
                  </Pressable>
                </View>
              </View>

              {/* Physical Information Section */}
              <View className="bg-white dark:bg-zinc-700 p-4 rounded-2xl">
                <Text className="font-bold mb-4 text-base" style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827' }}>
                  مشخصات بدنی
                </Text>
                <View className="space-y-2">
                  <Pressable className="flex-row items-center justify-between p-3 rounded-2xl active:bg-slate-100 dark:active:bg-slate-700/50">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-lg">🏋️</Text>
                      <Text className="font-medium text-sm text-gray-900 dark:text-white">
                        اهداف و مشخصات
                      </Text>
                    </View>
                    <Text className="text-lg">›</Text>
                  </Pressable>
                </View>
              </View>

              {/* Programs and Payments Section */}
              <View className="bg-white dark:bg-zinc-700 p-4 rounded-2xl">
                <Text className="font-bold mb-4 text-base" style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827' }}>
                  برنامه‌ها و پرداخت‌ها
                </Text>
                <View className="space-y-2">
                  <Pressable className="flex-row items-center justify-between p-3 rounded-2xl active:bg-slate-100 dark:active:bg-slate-700/50">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-lg">📋</Text>
                      <Text className="font-medium text-sm text-gray-900 dark:text-white">
                        برنامه‌های فعال
                      </Text>
                    </View>
                    <Text className="text-lg">›</Text>
                  </Pressable>

                  <Pressable className="flex-row items-center justify-between p-3 rounded-2xl active:bg-slate-100 dark:active:bg-slate-700/50">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-lg">💳</Text>
                      <Text className="font-medium text-sm text-gray-900 dark:text-white">
                        تاریخچه پرداخت‌ها
                      </Text>
                    </View>
                    <Text className="text-lg">›</Text>
                  </Pressable>
                </View>
              </View>

              {/* Support Section */}
                <View className="bg-white dark:bg-zinc-700 p-4 rounded-2xl">
                <Text className="font-bold mb-4 text-base" style={{ color: theme === 'dark' ? '#f3f4f6' : '#111827' }}>
                  پشتیبانی
                </Text>
                <View className="space-y-2">
                  <Pressable className="flex-row items-center justify-between p-3 rounded-2xl active:bg-slate-100 dark:active:bg-slate-700/50">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-lg">💬</Text>
                      <Text className="font-medium text-sm text-gray-900 dark:text-white">
                        ارتباط با ما
                      </Text>
                    </View>
                    <Text className="text-lg">›</Text>
                  </Pressable>

                    <Pressable className="flex-row items-center justify-between p-3 rounded-2xl active:bg-slate-100 dark:active:bg-slate-700/50">
                    <View className="flex-row items-center gap-3">
                      <Text className="text-lg">❓</Text>
                      <Text className="font-medium text-sm text-gray-900 dark:text-white">
                        سوالات متداول
                      </Text>
                    </View>
                    <Text className="text-lg">›</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Logout Button */}
            <View className="pt-4">
            <Pressable
              onPress={handleLogout}
              className="flex-row items-center justify-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 active:bg-red-100 dark:active:bg-red-900/30"
              android_ripple={{ color: 'rgba(239, 68, 68, 0.1)' }}
            >
                <Text className="text-lg mr-2">🚪</Text>
                <Text className="text-red-500 font-bold text-sm">
                  خروج از حساب
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
   
    </View>
  );
}
