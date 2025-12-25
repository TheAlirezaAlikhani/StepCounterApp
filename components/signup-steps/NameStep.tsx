import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../hooks/theme-context';
import type { StepComponentProps } from './types';

export function NameStep({ value, onChange, onEnter, disabled, currentStepId = 6 }: StepComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
          نام خود را وارد کنید
        </Text>
        <Text 
          className="text-base mt-2 text-center"
          style={{ color: colors.textMuted }}
        >
          نام شما در پروفایل نمایش داده خواهد شد.
        </Text>
      </View>

      <View className="px-3">
        <TextInput
          className="w-full px-4 py-4 rounded-xl text-lg text-right"
          style={{ 
            backgroundColor: colors.background,
            color: colors.textPrimary,
          }}
          placeholder="نام و نام خانوادگی"
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChange}
          editable={!disabled}
          onSubmitEditing={onEnter}
          autoCapitalize="words"
        />
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

export default NameStep;
