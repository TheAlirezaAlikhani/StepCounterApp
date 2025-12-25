import React, { useState, useCallback, type ComponentType } from 'react';
import { View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../../hooks/theme-context';

// Import step components
import { ImageStep } from '../../../components/signup-steps/ImageStep';
import { PhoneStep } from '../../../components/signup-steps/PhoneStep';
import { OTPStep } from '../../../components/signup-steps/OTPStep';
import { NameStep } from '../../../components/signup-steps/NameStep';
import { WeightStep } from '../../../components/signup-steps/WeightStep';
import { HeightStep } from '../../../components/signup-steps/HeightStep';
import { PainStep } from '../../../components/signup-steps/PainStep';
import type { StepComponentProps } from '../../../components/signup-steps/types';

interface StepDefinition {
  id: number;
  component: ComponentType<StepComponentProps & { stepNumber?: 1 | 2 | 3 }>;
  title: string;
  isImageStep?: boolean;
  stepNumber?: 1 | 2 | 3;
}

const steps: StepDefinition[] = [
  { id: 1, component: ImageStep, title: 'خوش آمدید', isImageStep: true, stepNumber: 1 },
  { id: 2, component: ImageStep, title: 'شروع کنید', isImageStep: true, stepNumber: 2 },
  { id: 3, component: ImageStep, title: 'به ما بپیوندید', isImageStep: true, stepNumber: 3 },
  { id: 4, component: PhoneStep, title: 'شماره موبایل' },
  { id: 5, component: OTPStep, title: 'کد تایید' },
  { id: 6, component: NameStep, title: 'نام' },
  { id: 7, component: WeightStep, title: 'وزن' },
  { id: 8, component: HeightStep, title: 'قد' },
  { id: 9, component: PainStep, title: 'نقاط درد' },
];

export default function SignupWizard() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<number, string>>({});
  const [isLoading] = useState(false);

  const currentStep = steps[currentStepIndex];
  const currentStepId = currentStep.id;
  const currentValue = formValues[currentStepId] ?? '';
  const isImageStep = currentStep.isImageStep;

  // Validation for each step
  const isCurrentValid = useCallback(() => {
    if (currentStepId <= 3) {
      // Image steps: always valid
      return true;
    }
    if (currentStepId === 4) {
      // Phone: must be 11 digits
      const digitsOnly = currentValue.replace(/\D/g, '');
      return digitsOnly.length === 11;
    }
    if (currentStepId === 5) {
      // OTP: must be 5 digits
      return currentValue && currentValue.length === 5 && /^\d{5}$/.test(currentValue);
    }
    if (currentStepId === 6) {
      // Name: must have at least 2 characters
      return currentValue && currentValue.trim().length >= 2;
    }
    if (currentStepId === 7) {
      // Weight: must be between 1 and 250
      const numValue = Number(currentValue);
      return currentValue && !isNaN(numValue) && numValue > 0 && numValue <= 250;
    }
    if (currentStepId === 8) {
      // Height: must be between 100 and 240
      const numValue = Number(currentValue);
      return currentValue && !isNaN(numValue) && numValue >= 100 && numValue <= 240;
    }
    if (currentStepId === 9) {
      // Pain points: optional, always valid
      return true;
    }
    return false;
  }, [currentStepId, currentValue]);

  const handleValueChange = (stepId: number, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [stepId]: value,
    }));
  };

  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < steps.length - 1 && isCurrentValid() && !isLoading;

  const handleNext = async () => {
    if (!canGoNext) return;

    // TODO: Add authentication logic for Phone/OTP steps later
    
    if (currentStepId === 9) {
      // Last step - save and redirect
      // TODO: Implement save logic
      console.log('Form completed:', formValues);
      router.push('/');
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!canGoPrev) return;
    setCurrentStepIndex((prev) => prev - 1);
  };

  const colors = {
    background: isDark ? '#121212' : '#FFFFFF',
    textPrimary: isDark ? '#F8FAFC' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    primary: '#A855F7',
    progressBg: isDark ? '#374151' : '#E5E7EB',
  };

  // Render current step with animation
  const renderStep = () => {
    const step = steps[currentStepIndex];
    const value = formValues[step.id] ?? '';
    const StepComponent = step.component;

    const content = step.isImageStep ? (
      <StepComponent
        stepNumber={step.stepNumber}
        value={value}
        onChange={(val) => handleValueChange(step.id, val)}
        onEnter={handleNext}
        disabled={isLoading}
        allFormValues={formValues}
        currentStepId={currentStepId}
      />
    ) : (
      <StepComponent
        value={value}
        onChange={(val) => handleValueChange(step.id, val)}
        onEnter={handleNext}
        disabled={isLoading}
        allFormValues={formValues}
        currentStepId={currentStepId}
      />
    );

    return (
      <Animated.View 
        key={step.id} // Key is crucial for reanimated to detect change
        entering={FadeIn.duration(300)} 
        exiting={FadeOut.duration(300)}
        style={{ flex: 1 }}
      >
        {content}
      </Animated.View>
    );
  };

  // For Image Steps - Full screen without any padding
  if (isImageStep) {
    return (
      <View className="flex-1" style={{ backgroundColor: '#000000' }}>
        {renderStep()}
      </View>
    );
  }

  // For Form Steps - With proper padding and controls
  return (
    <KeyboardAvoidingView 
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ backgroundColor: colors.background }}
    >
      <View className="flex-1">
        {/* Header with Back Button and Dot Pagination */}
        <View className="pt-12 pb-4 px-4">
          <View className="flex-row items-center justify-between h-12">
            {canGoPrev ? (
              <>
                <View className="w-16 items-start">
                  <Pressable
                    onPress={handlePrev}
                    className="h-12 w-12 items-center justify-center rounded-full active:opacity-70"
                    style={{ backgroundColor: isDark ? '#1E293B' : '#F8FAFC' }}
                  >
                    <ChevronRight size={28} color={colors.textMuted} />
                  </Pressable>
                </View>
                {/* 6 Dots Pagination for Steps 4-9 */}
                <View className="flex-1 items-center justify-center mx-4">
                  <View className="flex-row items-center gap-2">
                    {[4, 5, 6, 7, 8, 9].map((step) => {
                      const isActive = step === currentStepId;
                      return (
                        <View
                          key={step}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isActive ? 'w-8 bg-[#A855F7]' : 'w-2 bg-gray-400/40'
                          }`}
                        />
                      );
                    })}
                  </View>
                </View>
                <View className="w-16" />
              </>
            ) : (
              <View className="flex-1 items-center">
                {/* 6 Dots Pagination for Steps 4-9 */}
                <View className="flex-row items-center gap-2">
                  {[4, 5, 6, 7, 8, 9].map((step) => {
                    const isActive = step === currentStepId;
                    return (
                      <View
                        key={step}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isActive ? 'w-8 bg-[#A855F7]' : 'w-2 bg-gray-400/40'
                        }`}
                      />
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Current Step Content */}
        <View className="flex-1">
          {renderStep()}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
