import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import WheelPicker from '@quidone/react-native-wheel-picker';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../hooks/theme-context';
import type { StepComponentProps } from './types';

const MIN_WEIGHT = 30;
const MAX_WEIGHT = 200;

// Generate weight options once
const weightData = Array.from(
  { length: MAX_WEIGHT - MIN_WEIGHT + 1 },
  (_, i) => ({ value: MIN_WEIGHT + i })
);

export function WeightStep({ value, onChange, disabled, onEnter, currentStepId = 7 }: StepComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const currentValue = value ? parseInt(value) : 70;

  useEffect(() => {
    if (!value) {
      onChange('70');
    }
  }, [value, onChange]);

  const colors = {
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    cardBg: isDark ? '#27272A' : '#E4E4E7',
    cardBorder: isDark ? '#3F3F46' : '#D4D4D8',
    primary: '#A855F7',
  };

  return (
    <View className="flex-1 w-full px-6 pt-8">
      <View className="items-center mb-10">
        <Text 
          className="text-3xl font-bold text-center"
          style={{ color: colors.textPrimary }}
        >
          وزن شما چقدر است؟
        </Text>
        <Text 
          className="text-base mt-2 text-center"
          style={{ color: colors.textMuted }}
        >
          این به ما کمک می‌کند تا یک برنامه شخصی‌سازی شده برای شما ایجاد کنیم.
        </Text>
      </View>

      <View className="items-center justify-center flex-1">
        <View className="items-center">
          {/* Wheel Picker */}
          <View 
            className="rounded-3xl overflow-hidden"
            style={{ 
              backgroundColor: colors.cardBg,
              borderWidth: 2,
              borderColor: colors.cardBorder,
            }}
          >
            <WheelPicker
              data={weightData}
              value={currentValue}
              onValueChanged={({ item }: { item: { value: number } }) => onChange(item.value.toString())}
              itemHeight={60}
              visibleItemCount={5}
              width={200}
              readOnly={disabled}
              scrollEventThrottle={1}
              itemTextStyle={{
                fontSize: 28,
                fontWeight: '600',
                color: colors.textPrimary,
              }}
              overlayItemStyle={{
                borderTopWidth: 2,
                borderBottomWidth: 2,
                borderColor: colors.primary,
                backgroundColor: 'transparent',
              }}
              keyExtractor={(item: { value: number }) => item.value.toString()}
            />
          </View>
          
          <Text 
            className="text-xl font-medium mt-4"
            style={{ color: colors.textMuted }}
          >
            کیلوگرم
          </Text>
        </View>
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

export default WeightStep;
