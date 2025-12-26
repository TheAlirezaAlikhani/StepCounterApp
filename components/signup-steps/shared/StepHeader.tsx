import React, { memo } from 'react';
import { View } from 'react-native';
import { Text } from '../../ui/Text';
import type { useStepColors } from './useStepColors';

interface StepHeaderProps {
  title: string;
  description: string;
  colors: ReturnType<typeof useStepColors>;
}

export const StepHeader = memo(function StepHeader({ title, description, colors }: StepHeaderProps) {
  return (
    <View className="items-center mb-10">
      <Text
        weight="bold"
        className="text-3xl text-center"
        style={{ color: colors.textPrimary }}
      >
        {title}
      </Text>
      <Text
        className="text-base mt-2 text-center"
        style={{ color: colors.textMuted }}
      >
        {description}
      </Text>
    </View>
  );
});

