import React, { memo, useMemo, useCallback, useState } from 'react';
import { View, TextInput } from 'react-native';
import { Text } from '../../ui/Text';
import type { useStepColors } from './useStepColors';

interface NumberInputContainerProps {
  value: number;
  onChange: (value: string) => void;
  disabled?: boolean;
  unit: string;
  min?: number;
  max?: number;
  colors: ReturnType<typeof useStepColors>;
}

export const NumberInputContainer = memo(function NumberInputContainer({
  value,
  onChange,
  disabled,
  unit,
  min,
  max,
  colors,
}: NumberInputContainerProps) {
  // Initialize from value prop
  const [localValue, setLocalValue] = useState(() => {
    return value > 0 ? value.toString() : '';
  });

  const handleChange = useCallback(
    (text: string) => {
      // Remove non-numeric characters
      const numericValue = text.replace(/[^0-9]/g, '');
      
      if (numericValue === '') {
        setLocalValue('');
        return;
      }

      const numValue = parseInt(numericValue, 10);
      
      // Only enforce max constraint while typing (if clearly exceeds max)
      if (max !== undefined && numValue > max) {
        setLocalValue(max.toString());
        return;
      }

      // Allow any numeric input while typing - don't enforce min yet
      // Don't call onChange here - only update local state
      setLocalValue(numericValue);
    },
    [max]
  );

  const handleBlur = useCallback(() => {
    if (localValue === '') {
      onChange('');
      return;
    }

    const numValue = parseInt(localValue, 10);
    let finalValue = localValue;
    
    // Apply min constraint when user finishes typing
    if (min !== undefined && numValue < min) {
      finalValue = min.toString();
      setLocalValue(finalValue);
    }
    
    // Apply max constraint (shouldn't happen, but just in case)
    if (max !== undefined && numValue > max) {
      finalValue = max.toString();
      setLocalValue(finalValue);
    }

    // Update parent with final validated value
    onChange(finalValue);
  }, [localValue, min, max, onChange]);

  const containerStyle = useMemo(
    () => ({
      backgroundColor: colors.cardBg,
      borderWidth: 2,
      borderColor: colors.cardBorder,
    }),
    [colors.cardBg, colors.cardBorder]
  );

  const inputStyle = useMemo(
    () => ({
      fontSize: 48,
      fontWeight: '700' as const,
      color: colors.textPrimary,
      textAlign: 'center' as const,
    }),
    [colors.textPrimary]
  );

  // Sync local value with prop value when it changes externally
  React.useEffect(() => {
    const propValueStr = value > 0 ? value.toString() : '';
    // Only sync if we're not actively typing (local value matches prop or is empty)
    if (localValue === '' || localValue === propValueStr) {
      setLocalValue(propValueStr);
    }
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // Use local value for display (allows free typing)
  const displayValue = localValue;

  return (
    <View className="items-center justify-center flex-1">
      <View className="items-center">
        <View 
          className="rounded-3xl px-8 py-6"
          style={containerStyle}
        >
          <View className="flex-row items-center justify-center">
            <TextInput
              value={displayValue}
              onChangeText={handleChange}
              onBlur={handleBlur}
              keyboardType="number-pad"
              editable={!disabled}
              style={inputStyle}
              maxLength={3}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
            <Text
              weight="medium"
              className="text-2xl mr-3"
              style={{ color: colors.textMuted }}
            >
              {unit}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

