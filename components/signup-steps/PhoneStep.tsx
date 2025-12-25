import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../hooks/theme-context';
import type { StepComponentProps } from './types';

export function PhoneStep({ value, onChange, onEnter, disabled, currentStepId = 4 }: StepComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const formatPhoneNumber = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
      return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
    }
    return digitsOnly;
  };

  const handleChange = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '');
    if (digitsOnly.length <= 11) {
      onChange(digitsOnly);
    }
  };

  const colors = {
    background: isDark ? '#1E293B' : '#F8FAFC',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    primary: '#A855F7',
    progressBg: isDark ? '#374151' : '#E5E7EB',
  };

  return (
    <View className="flex-1 w-full px-6 pt-8">
      <View className="items-center mb-10">
        <Text 
          className="text-3xl font-bold text-center"
          style={{ color: colors.textPrimary }}
        >
          شماره موبایل خود را وارد کنید
        </Text>
        <Text 
          className="text-base mt-2 text-center"
          style={{ color: colors.textMuted }}
        >
          برای تایید حساب کاربری شما استفاده خواهد شد.
        </Text>
      </View>

      <View className="px-3">
        <TextInput
          className="w-full px-4 py-4  rounded-xl text-lg text-center tracking-widest"
          style={{ 
            direction: 'ltr',
            backgroundColor: colors.background,
            color: colors.textPrimary,
          }}
          placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          value={formatPhoneNumber(value)}
          onChangeText={handleChange}
          editable={!disabled}
          onSubmitEditing={onEnter}
          maxLength={13}
        />
      </View>

      <View className="pt-6 px-4">
        <Text 
          className="text-center text-xs"
          style={{ color: colors.textMuted }}
        >
          با ادامه، شما با{' '}
          <Text style={{ color: colors.primary }} className="font-medium">
            شرایط خدمات
          </Text>
          {' '}و{' '}
          <Text style={{ color: colors.primary }} className="font-medium">
            سیاست حفظ حریم خصوصی
          </Text>
          {' '}ما موافقت می‌کنید.
        </Text>
      </View>

      {/* Bottom Navigation Area - Only Next Button */}
      <View className="flex-row items-center justify-end mt-auto mb-24">
        {/* Next Button - Will be on LEFT in RTL (End) */}
        <Pressable
          onPress={onEnter}
          disabled={disabled}
          className="w-14 h-14 bg-[#A855F7] rounded-xl items-center justify-center active:opacity-80"
          style={{
            shadowColor: "#A855F7",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 8,
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <ArrowLeft color="white" size={24} strokeWidth={2.5} />
        </Pressable>
      </View>
    </View>
  );
}

export default PhoneStep;
