import React from 'react';
import { View, Pressable } from 'react-native';
import { useTheme } from '../../hooks/theme-context';
import type { StepComponentProps } from './types';
import { Text } from '../ui/Text';
import { NextButton } from './shared/NextButton';

// Pain options using exact API allowed values
const painOptions = [
  { value: 'درد گردن', label: 'درد گردن' },
  { value: 'درد کتف', label: 'درد کتف' },
  { value: 'کمردرد (سیاتیک)', label: 'کمردرد (سیاتیک)' },
  { value: 'زانو درد', label: 'زانو درد' },
  { value: 'درد مچ', label: 'درد مچ' },
];

export function PainStep({ value, onChange, disabled, isValid, onEnter, currentStepId = 9 }: StepComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const selectedPains = value ? value.split(',').filter(Boolean) : [];

  const togglePain = (painValue: string) => {
    if (disabled) return;
    const newSelected = selectedPains.includes(painValue)
      ? selectedPains.filter((p) => p !== painValue)
      : [...selectedPains, painValue];
    onChange(newSelected.join(','));
  };

  const colors = {
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    badgeBg: isDark ? '#27272A' : 'rgba(255, 255, 255, 0.9)',
    badgeBorder: isDark ? '#3F3F46' : '#E5D9FF',
    selectedBg: '#A855F7',
    primary: '#A855F7',
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
          نقاط درد
        </Text>
        <Text 
          className="text-base mt-2 text-center"
          style={{ color: colors.textMuted }}
        >
          آیا در ناحیه‌ای احساس درد می‌کنید؟ (اختیاری)
        </Text>
      </View>

      <View className="flex-row flex-wrap items-center justify-center gap-3 px-4">
        {painOptions.map((option) => {
          const isSelected = selectedPains.includes(option.value);
          return (
            <Pressable
              key={option.value}
              onPress={() => togglePain(option.value)}
              disabled={disabled}
              className="rounded-xl px-5 py-3"
              style={[
                {
                  backgroundColor: isSelected ? colors.selectedBg : colors.badgeBg,
                  borderWidth:  2,
                  borderColor: colors.badgeBorder,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  opacity: disabled ? 0.5 : 1,
                },
              ]}
            >
              <Text
                weight="semiBold"
                className="text-sm"
                style={{
                  color: isSelected ? '#FFFFFF' : colors.textMuted,
                }}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Bottom Navigation Area - Only Next Button */}
      <NextButton onPress={onEnter} disabled={disabled || !isValid} />
    </View>
  );
}

export default PainStep;
