import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../hooks/theme-context';
import type { StepComponentProps } from './types';

export function OTPStep({ value, onChange, onEnter, disabled, allFormValues, currentStepId = 5 }: StepComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

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

  const handleResend = () => {
    if (!canResend) return;
    // TODO: Implement resend logic
    setCountdown(60);
    setCanResend(false);
  };

  const colors = {
    background: isDark ? '#1E293B' : '#F8FAFC',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    primary: '#A855F7',
    border: isDark ? '#334155' : '#E2E8F0',
    progressBg: isDark ? '#374151' : '#E5E7EB',
  };

  return (
    <View className="flex-1 w-full px-6 pt-8">
      <View className="items-center mb-10">
        <Text 
          className="text-3xl font-bold text-center"
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
          focusColor={colors.primary}
          autoFocus={true}
          disabled={disabled}
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
              borderColor: colors.border,
            },
            focusedPinCodeContainerStyle: {
              borderColor: colors.primary,
              borderWidth: 2,
            },
            pinCodeTextStyle: {
              fontSize: 20,
              color: colors.textPrimary,
            },
          }}
        />
      </View>

      <View className="mt-8 items-center">
        <Text style={{ color: colors.textMuted }} className="text-sm text-center">
          کدی دریافت نکردید؟{' '}
          <Text
            onPress={handleResend}
            style={{ 
              color: canResend ? colors.primary : colors.textMuted,
              opacity: canResend ? 1 : 0.5,
            }}
            className="font-medium"
          >
            ارسال مجدد کد
          </Text>
          {countdown > 0 && (
            <Text style={{ color: colors.textMuted }}> ({formatCountdown(countdown)})</Text>
          )}
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

export default OTPStep;
