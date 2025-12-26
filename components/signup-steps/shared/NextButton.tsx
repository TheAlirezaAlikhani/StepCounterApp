import React, { memo } from 'react';
import { View, Pressable, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface NextButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const shadowStyle = {
  shadowColor: '#A855F7',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 10,
  elevation: 8,
};

export const NextButton = memo(function NextButton({ onPress, disabled, isLoading }: NextButtonProps) {
  const isDisabled = disabled || !onPress || isLoading;

  return (
    <View className="flex-row items-center justify-end mt-auto mb-24">
      <Pressable
        onPress={onPress || (() => {})}
        disabled={isDisabled}
        className="w-14 h-14 rounded-xl items-center justify-center"
        style={[
          {
            backgroundColor: isDisabled ? '#9CA3AF' : '#A855F7',
            opacity: isDisabled ? 0.6 : 1,
          },
          !isDisabled && shadowStyle,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <ArrowLeft 
            color="white" 
            size={24} 
            strokeWidth={2.5}
            opacity={isDisabled ? 0.7 : 1}
          />
        )}
      </Pressable>
    </View>
  );
});
