import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ChevronLeft, Edit, Mars, Venus } from 'lucide-react-native';
import { useTheme } from '../../../../hooks/theme-context';
import { useRouter } from 'expo-router';

export default function ProfileEditPage() {
  const { theme } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "کاربر نمونه",
    gender: "male",
    email: "user@example.com",
    birthdate: "",
    telegramCode: "",
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleSubmit = () => {
    // Handle form submission
    Alert.alert('موفق', 'تغییرات ذخیره شد');
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenderChange = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#18181B' : '#F7FAFC' }}>
      <View className="max-w-md mx-auto flex-1">
        {/* Header */}
        <View className="p-6 flex-row items-center justify-between w-full">
          <Text className="text-2xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
            ویرایش پروفایل
          </Text>
          <TouchableOpacity
            onPress={handleBackPress}
            className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800 active:bg-gray-200 dark:active:bg-zinc-700"
          >
            <ChevronLeft size={24} color={theme === 'dark' ? '#ffffff' : '#111827'} />
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-6 pb-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Profile Picture */}
          <View className="items-center pt-4 pb-8">
            <View className="relative w-24 h-24 mb-4">
              <View className="w-24 h-24 rounded-full bg-gray-200 dark:bg-zinc-700 items-center justify-center">
                <Text className="text-2xl" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                  👤
                </Text>
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full items-center justify-center shadow-md">
                <Edit size={16} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm font-medium" style={{ color: theme === 'dark' ? '#a855f7' : '#8B5CF6' }}>
              تغییر تصویر پروفایل
            </Text>
          </View>

          {/* Form */}
          <View className="gap-5">
            {/* Name */}
            <View className="gap-3">
              <Text className="text-sm font-medium" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                نام
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(value) => handleChange("name", value)}
                className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                style={{
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                  textAlign: 'right'
                }}
                placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
            </View>

            {/* Gender */}
            <View className="gap-3">
              <Text className="text-sm font-medium" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                جنسیت
              </Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => handleGenderChange("female")}
                  className={`flex-1 flex-row items-center justify-center gap-2 px-4 py-4 rounded-xl border ${
                    formData.gender === "female"
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-600'
                      : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-600'
                  }`}
                >
                  <Venus size={20} color={formData.gender === "female" ? '#8B5CF6' : (theme === 'dark' ? '#9ca3af' : '#6b7280')} />
                  <Text className={`font-medium ${formData.gender === "female" ? 'text-purple-600' : ''}`}
                        style={{ color: formData.gender === "female" ? '#8B5CF6' : (theme === 'dark' ? '#ffffff' : '#111827') }}>
                    زن
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleGenderChange("male")}
                  className={`flex-1 flex-row items-center justify-center gap-2 px-4 py-4 rounded-xl border ${
                    formData.gender === "male"
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-600'
                      : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-600'
                  }`}
                >
                  <Mars size={20} color={formData.gender === "male" ? '#8B5CF6' : (theme === 'dark' ? '#9ca3af' : '#6b7280')} />
                  <Text className={`font-medium ${formData.gender === "male" ? 'text-purple-600' : ''}`}
                        style={{ color: formData.gender === "male" ? '#8B5CF6' : (theme === 'dark' ? '#ffffff' : '#111827') }}>
                    مرد
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Email */}
            <View className="gap-3">
              <Text className="text-sm font-medium" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                ایمیل
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleChange("email", value)}
                placeholder="example@example.com"
                className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                style={{
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                  textAlign: 'right'
                }}
                placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
            </View>

            {/* Birthdate */}
            <View className="gap-3">
              <Text className="text-sm font-medium" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                تاریخ تولد
              </Text>
              <TouchableOpacity className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800">
                <Text className="text-right" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                  انتخاب تاریخ تولد
                </Text>
              </TouchableOpacity>
            </View>

            {/* Telegram Code */}
            <View className="gap-3">
              <Text className="text-sm font-medium" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                کد اتصال به ربات تلگرام
              </Text>
              <TextInput
                value={formData.telegramCode}
                onChangeText={(value) => handleChange("telegramCode", value)}
                className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800"
                style={{
                  color: theme === 'dark' ? '#ffffff' : '#111827',
                  textAlign: 'right'
                }}
                placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
            </View>
          </View>

          {/* Submit Button */}
          <View className="pt-6 pb-8">
            <TouchableOpacity
              onPress={handleSubmit}
              className="w-full bg-purple-600 py-4 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-bold text-base">
                ذخیره تغییرات
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
