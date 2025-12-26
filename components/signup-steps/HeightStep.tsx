import React, { useMemo, memo } from 'react';
import { View } from 'react-native';
import type { StepComponentProps } from './types';
import { useStepColors } from './shared/useStepColors';
import { StepHeader } from './shared/StepHeader';
import { NumberInputContainer } from './shared/WheelPickerContainer';
import { NextButton } from './shared/NextButton';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 220;

function HeightStepComponent({ value, onChange, disabled, isValid, onEnter, currentStepId = 8 }: StepComponentProps) {
  const colors = useStepColors();
  
  const currentValue = useMemo(() => {
    if (!value || value === '') return 0;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [value]);

  // Button is disabled if loading OR step is invalid
  const isButtonDisabled = disabled || !isValid;

  return (
    <View className="flex-1 w-full px-6 pt-8">
      <StepHeader
        title="قد شما چقدر است؟"
        description="این به ما کمک می‌کند تا یک برنامه شخصی برای شما ایجاد کنیم."
        colors={colors}
      />

      <NumberInputContainer
        value={currentValue}
        onChange={onChange}
        disabled={disabled}
        unit="سانتی‌متر"
        min={MIN_HEIGHT}
        max={MAX_HEIGHT}
        colors={colors}
      />

      <NextButton onPress={onEnter} disabled={isButtonDisabled} />
    </View>
  );
}

export const HeightStep = memo(HeightStepComponent);
export default HeightStep;
