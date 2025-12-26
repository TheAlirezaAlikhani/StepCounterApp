import React from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import { useTheme } from '../../hooks/theme-context';
import type { StepComponentProps } from './types';
import { Text } from '../ui/Text';
import { NextButton } from './shared/NextButton';

export function PhoneStep({ 
  value, 
  onChange, 
  onEnter, 
  disabled, 
  isValid, 
  currentStepId = 4,
  error,
  isLoading,
}: StepComponentProps) {
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
    error: '#EF4444',
    progressBg: isDark ? '#374151' : '#E5E7EB',
  };

  return (
    <View className="flex-1 w-full px-6 pt-8">
      <View className="items-center mb-10">
        <Text 
          weight="bold"
          className="text-3xl  text-center"
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
            borderWidth: error ? 1 : 0,
            borderColor: error ? colors.error : 'transparent',
          }}
          placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
          value={formatPhoneNumber(value)}
          onChangeText={handleChange}
          editable={!disabled && !isLoading}
          onSubmitEditing={onEnter}
          maxLength={13}
        />
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <View className="mt-4 items-center">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="text-sm mt-2" style={{ color: colors.textMuted }}>
            در حال ارسال کد...
          </Text>
        </View>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <View className="mt-4 items-center">
          <Text className="text-sm text-center" style={{ color: colors.error }}>
            {error}
          </Text>
        </View>
      )}

      <View className="pt-6 px-4">
        <Text 
          className="text-center text-xs"
          style={{ color: colors.textMuted }}
        >
          با ادامه، شما با{' '}
          <Text weight="medium" style={{ color: colors.primary }}>
            شرایط خدمات
          </Text>
          {' '}و{' '}
          <Text weight="medium" style={{ color: colors.primary }}>
            سیاست حفظ حریم خصوصی
          </Text>
          {' '}ما موافقت می‌کنید.
        </Text>
      </View>

      {/* Bottom Navigation Area - Only Next Button */}
      <NextButton 
        onPress={onEnter} 
        disabled={disabled || !isValid || isLoading} 
        isLoading={isLoading}
      />
    </View>
  );
}

export default PhoneStep;
