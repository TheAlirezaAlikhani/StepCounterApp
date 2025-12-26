import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { ChevronLeft, Mail, Send } from 'lucide-react-native';
import { useTheme } from '../../../../hooks/theme-context';
import { useRouter } from 'expo-router';
import { Text } from '../../../../components/ui/Text';

export default function ContactUsPage() {
  const { theme } = useTheme();
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleBackPress = () => {
    router.back();
  };

  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('خطا', 'نتوانستیم لینک را باز کنیم');
    }
  };

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('خطا', 'لطفاً همه فیلدها را پر کنید');
      return;
    }
    // Handle form submission
    Alert.alert('موفق', 'پیام شما ارسال شد');
    setSubject("");
    setMessage("");
  };

  const contactMethods = [
    {
      id: 'telegram',
      title: 'تلگرام',
      subtitle: '@letsfitsupport',
      url: 'https://t.me/letsfitsupport',
      icon: 'telegram'
    },
    {
      id: 'whatsapp',
      title: 'واتساپ',
      subtitle: '09134974953',
      url: 'https://wa.me/989134974953',
      icon: 'whatsapp'
    },
    {
      id: 'email',
      title: 'ایمیل',
      subtitle: 'info@letsfit.net',
      url: 'mailto:info@letsfit.net',
      icon: 'email'
    },
    {
      id: 'instagram',
      title: 'اینستاگرام',
      subtitle: '@letsfitnet',
      url: 'https://instagram.com/letsfitnet',
      icon: 'instagram'
    },
  ];

  const getIcon = (iconType: string) => {
    // For now, using Mail icon for all. In a real app, you'd import specific icons
    return <Mail size={20} color="#8B5CF6" />;
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme === 'dark' ? '#18181B' : '#F7FAFC' }}>
      <View className="max-w-md mx-auto flex-1">
        {/* Header */}
        <View className="p-6 flex-row items-center justify-between w-full">
          <Text weight="bold" className="text-2xl" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
            ارتباط با ما
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
          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
              برای پشتیبانی، سوالات یا هرگونه بازخورد، از راه‌های زیر با ما در تماس باشید.
            </Text>
          </View>

          {/* Contact Methods */}
          <View className="gap-4 mb-8">
            <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl">
              <Text weight="bold" className="text-base mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
                راه‌های ارتباطی
              </Text>
              <View className="gap-2">
                {contactMethods.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => handleLinkPress(method.url)}
                    className="flex-row items-center justify-between p-3 rounded-lg active:bg-gray-50 dark:active:bg-zinc-700"
                  >
                    <View className="flex-row items-center gap-3">
                      {getIcon(method.icon)}
                      <Text weight="medium" className="text-sm" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
                        {method.title}
                      </Text>
                    </View>
                    <Text className="text-sm" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                      {method.subtitle}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Contact Form */}
            <View className="bg-white dark:bg-zinc-800 p-4 rounded-xl">
              <Text weight="bold" className="text-base mb-4" style={{ color: theme === 'dark' ? '#ffffff' : '#111827' }}>
                ارسال پیام مستقیم
              </Text>
              <View className="gap-4">
                <View>
                  <Text weight="medium" className="text-sm mb-2" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                    موضوع
                  </Text>
                  <TextInput
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="موضوع"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                    style={{
                      color: theme === 'dark' ? '#ffffff' : '#111827',
                      textAlign: 'right'
                    }}
                    placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                  />
                </View>

                <View>
                  <Text weight="medium" className="text-sm mb-2" style={{ color: theme === 'dark' ? '#9ca3af' : '#6b7280' }}>
                    پیام شما
                  </Text>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="پیام شما..."
                    multiline
                    numberOfLines={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-700"
                    style={{
                      color: theme === 'dark' ? '#ffffff' : '#111827',
                      textAlign: 'right',
                      textAlignVertical: 'top'
                    }}
                    placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  className="w-full bg-purple-600 py-4 rounded-xl flex-row items-center justify-center gap-2"
                >
                  <Send size={16} color="#ffffff" />
                  <Text weight="bold" className="text-white text-base">
                    ارسال پیام
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
