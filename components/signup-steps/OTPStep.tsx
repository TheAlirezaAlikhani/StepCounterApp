import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { useTheme } from '../../hooks/theme-context';
import type { StepComponentProps } from './types';
import { Text } from '../ui/Text';
import { NextButton } from './shared/NextButton';

export function OTPStep({ 
  value, 
  onChange, 
  onEnter, 
  disabled, 
  isValid, 
  allFormValues, 
  currentStepId = 5,
  error,
  isLoading,
  onResendOTP,
}: StepComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Get phone number from form values (step id 4)
  const phoneNumber = allFormValues?.[4] || '';
  
  const formatPhoneNumber = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (digitsOnly.length === 11) {
      return `${digitsOnly.slice(0, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
    }
    return digitsOnly;
  };

  // Convert English digits to Persian
  const toPersianDigits = (str: string): string => {
    const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
  };

  const displayPhone = phoneNumber ? toPersianDigits(formatPhoneNumber(phoneNumber)) : '۰۹۱۲ ۳۴۵ ۶۷۸۹';

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    
    setIsResending(true);
    try {
      if (onResendOTP) {
        const success = await onResendOTP();
        if (success) {
    setCountdown(60);
    setCanResend(false);
        }
      }
    } finally {
      setIsResending(false);
    }
  };

  const colors = {
    background: isDark ? '#1E293B' : '#F8FAFC',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    primary: '#A855F7',
    border: isDark ? '#334155' : '#E2E8F0',
    error: '#EF4444',
    progressBg: isDark ? '#374151' : '#E5E7EB',
  };

  return (
    <View className="flex-1 w-full px-6 pt-8">
      <View className="items-center mb-10">
        <Text 
          weight="bold"
          className="text-3xl text-center"
          style={{ color: colors.textPrimary }}
        >
          کد تایید
        </Text>
        <Text 
          className="text-base mt-2 text-center px-4"
          style={{ color: colors.textMuted }}
        >
          کد ۵ رقمی ارسال شده به شماره {displayPhone} را وارد کنید.
        </Text>
      </View>

      <View className="items-center justify-center">
        <OtpInput
          numberOfDigits={5}
          focusColor={error ? colors.error : colors.primary}
          autoFocus={true}
          disabled={disabled || isLoading}
          onTextChange={onChange}
          onFilled={(code) => {
            onChange(code);
            onEnter?.();
          }}
          theme={{
            containerStyle: {
              gap: 8,
              direction: 'ltr',
            },
            pinCodeContainerStyle: {
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: colors.background,
              borderWidth: 1,
              borderColor: error ? colors.error : colors.border,
            },
            focusedPinCodeContainerStyle: {
              borderColor: error ? colors.error : colors.primary,
              borderWidth: 2,
            },
            pinCodeTextStyle: {
              fontSize: 20,
              color: colors.textPrimary,
            },
          }}
        />
      </View>

      {/* Loading indicator */}
      {isLoading && (
        <View className="mt-4 items-center">
          <ActivityIndicator size="small" color={colors.primary} />
          <Text className="text-sm mt-2" style={{ color: colors.textMuted }}>
            در حال تایید...
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

      <View className="mt-8 items-center">
        <Text style={{ color: colors.textMuted }} className="text-sm text-center">
          کدی دریافت نکردید؟{' '}
          {isResending ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginLeft: 8 }} />
          ) : (
          <Text
            onPress={handleResend}
            style={{ 
              color: canResend ? colors.primary : colors.textMuted,
              opacity: canResend ? 1 : 0.5,
            }}
            weight="medium"
          >
            ارسال مجدد کد
          </Text>
          )}
          {countdown > 0 && !isResending && (
            <Text style={{ color: colors.textMuted }}> ({formatCountdown(countdown)})</Text>
          )}
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

export default OTPStep;
