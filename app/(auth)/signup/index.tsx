import React, { useState, useCallback, type ComponentType } from 'react';
import { View, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../../../hooks/theme-context';
import { useSession } from '../../../context/ctx';
import { requestOTP, verifyOTP, checkUserExists, registerUser, updateUser, mapPainValuesToAPI } from '../../../services/api';

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
  const { signIn } = useSession();
  const isDark = theme === 'dark';
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const currentStep = steps[currentStepIndex];
  const currentStepId = currentStep.id;
  const currentValue = formValues[currentStepId] ?? '';
  const isImageStep = currentStep.isImageStep;

  // Validation for each step
  const isCurrentValid = useCallback((): boolean => {
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
      return Boolean(currentValue && currentValue.length === 5 && /^\d{5}$/.test(currentValue));
    }
    if (currentStepId === 6) {
      // Name: must have at least 2 characters
      return Boolean(currentValue && currentValue.trim().length >= 2);
    }
    if (currentStepId === 7) {
      // Weight: must be between 1 and 250
      const numValue = Number(currentValue);
      return Boolean(currentValue && !isNaN(numValue) && numValue > 0 && numValue <= 250);
    }
    if (currentStepId === 8) {
      // Height: must be between 100 and 240
      const numValue = Number(currentValue);
      return Boolean(currentValue && !isNaN(numValue) && numValue >= 100 && numValue <= 240);
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
    // Clear error when user types
    if (error) setError(null);
  };

  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < steps.length - 1 && isCurrentValid() && !isLoading;

  // Handle OTP request (PhoneStep -> OTPStep)
  const handleRequestOTP = async () => {
    const phoneNumber = formValues[4]?.replace(/\D/g, '');
    console.log('🔵 [SignupWizard] handleRequestOTP called');
    console.log('   Phone:', phoneNumber);
    
    if (!phoneNumber || phoneNumber.length !== 11) {
      console.log('❌ [SignupWizard] Invalid phone number');
      return false;
    }

    setIsLoading(true);
    setError(null);
    console.log('⏳ [SignupWizard] Loading started...');

    try {
      console.log('📞 [SignupWizard] Calling requestOTP API...');
      const result = await requestOTP(phoneNumber);
      console.log('✅ [SignupWizard] requestOTP returned:', JSON.stringify(result, null, 2));
      
      if (result.ok) {
        console.log('🎉 [SignupWizard] OTP sent successfully!');
        return true;
      } else {
        console.log('⚠️  [SignupWizard] OTP request failed:', result.error);
        setError(result.error || 'خطا در ارسال کد تایید');
        Alert.alert('خطا', result.error || 'خطا در ارسال کد تایید');
        return false;
      }
    } catch (err) {
      console.error('❌ [SignupWizard] Exception in handleRequestOTP:', err);
      setError('خطا در ارتباط با سرور');
      Alert.alert('خطا', 'خطا در ارتباط با سرور');
      return false;
    } finally {
      setIsLoading(false);
      console.log('⏹️  [SignupWizard] Loading ended');
    }
  };

  // Handle OTP verification (OTPStep -> Check if user exists)
  const handleVerifyOTP = async () => {
    const phoneNumber = formValues[4]?.replace(/\D/g, '');
    const otp = formValues[5];
    console.log('🔵 [SignupWizard] handleVerifyOTP called');
    console.log('   Phone:', phoneNumber);
    console.log('   OTP:', otp);
    
    if (!phoneNumber || !otp) {
      console.log('❌ [SignupWizard] Missing phone or OTP');
      return false;
    }

    setIsLoading(true);
    setError(null);
    console.log('⏳ [SignupWizard] Loading started...');

    try {
      // Step 1: Verify OTP
      console.log('🔐 [SignupWizard] Calling verifyOTP API...');
      const verifyResult = await verifyOTP(phoneNumber, otp);
      console.log('✅ [SignupWizard] verifyOTP returned:', JSON.stringify(verifyResult, null, 2));
      
      if (!verifyResult.ok) {
        console.log('⚠️  [SignupWizard] OTP verification failed:', verifyResult.error);
        setError(verifyResult.error || 'کد تایید نامعتبر است');
        Alert.alert('خطا', verifyResult.error || 'کد تایید نامعتبر است');
        return false;
      }

      // Step 2: Check if user exists with minimal registration attempt
      // Note: We don't create session yet to avoid redirecting to home
      console.log('👤 [SignupWizard] Checking if user exists...');
      const checkResult = await checkUserExists(phoneNumber);
      console.log('✅ [SignupWizard] checkUserExists returned:', JSON.stringify(checkResult, null, 2));

      // If we got a user_id (even with validation errors), store it
      if (checkResult.user_id) {
        setUserId(checkResult.user_id);
        console.log('💾 [SignupWizard] User ID stored:', checkResult.user_id);
      }

      // Step 3: Decide flow based on user status
      if (checkResult.ok && checkResult.isExistingUser && checkResult.user_id) {
        console.log('🔄 [SignupWizard] Existing user detected - creating session and redirecting to home');
        // User already exists - create session and skip profile steps
        const sessionToken = btoa(JSON.stringify({
          phoneNumber: verifyResult.phoneNumber || phoneNumber,
          authenticatedAt: Date.now(),
        }));
        signIn(sessionToken);
        router.replace('/');
        return false; // Don't proceed to next step
      } else if (checkResult.ok && !checkResult.isExistingUser && checkResult.user_id) {
        console.log('✨ [SignupWizard] New user created - proceeding to profile steps');
        // New user was created - continue to profile steps to update data
        // Don't create session yet - wait until profile is complete
        return true;
      } else {
        // Registration failed or validation error - proceed to profile steps anyway
        // We'll try to register/update with complete data later
        console.log('⚠️  [SignupWizard] Registration check failed, proceeding to profile steps');
        console.log('   Error:', checkResult.error || 'Unknown error');
        // Don't show error to user - let them complete profile and we'll handle it then
        return true;
      }
    } catch (err) {
      console.error('❌ [SignupWizard] Exception in handleVerifyOTP:', err);
      setError('خطا در تایید کد');
      Alert.alert('خطا', 'خطا در تایید کد');
      return false;
    } finally {
      setIsLoading(false);
      console.log('⏹️  [SignupWizard] Loading ended');
    }
  };

  // Handle profile update (last step - after collecting all data)
  const handleUpdateProfile = async () => {
    const name = formValues[6]?.trim();
    const weight = formValues[7];
    const height = formValues[8];
    const painValues = formValues[9] || '';
    
    console.log('🔵 [SignupWizard] handleUpdateProfile called');
    console.log('   User ID:', userId);
    console.log('   Name:', name);
    console.log('   Weight:', weight);
    console.log('   Height:', height);
    console.log('   Pain:', painValues);

    // If no userId, try to register first
    if (!userId) {
      console.log('⚠️  [SignupWizard] No user ID - attempting registration first...');
      const phoneNumber = formValues[5]?.trim();
      if (!phoneNumber) {
        console.log('❌ [SignupWizard] No phone number - cannot register');
        Alert.alert('خطا', 'خطا در ثبت نام');
        return false;
      }
      
      // Try to register with complete data
      const registerData = {
        digits_phone: phoneNumber,
        name: name || 'کاربر جدید',
        user_height: height || '170',
        user_weight: weight || '70',
        user_body_pain: mapPainValuesToAPI(painValues),
      };
      
      try {
        const registerResult = await registerUser(registerData);
        if (registerResult.ok && registerResult.user_id) {
          setUserId(registerResult.user_id);
          console.log('✅ [SignupWizard] User registered, ID:', registerResult.user_id);
          // Create session and redirect to home
          const sessionToken = btoa(JSON.stringify({
            phoneNumber: phoneNumber,
            authenticatedAt: Date.now(),
          }));
          signIn(sessionToken);
          router.replace('/');
          return true;
        } else {
          console.log('❌ [SignupWizard] Registration failed:', registerResult.error);
          Alert.alert('خطا', registerResult.error || 'خطا در ثبت نام');
          return false;
        }
      } catch (err) {
        console.error('❌ [SignupWizard] Registration exception:', err);
        Alert.alert('خطا', 'خطا در ثبت نام');
        return false;
      }
    }

    if (!name || !weight || !height) {
      console.log('❌ [SignupWizard] Missing required fields');
      Alert.alert('خطا', 'لطفا تمام فیلدها را پر کنید');
      return false;
    }

    setIsLoading(true);
    setError(null);
    console.log('⏳ [SignupWizard] Loading started...');

    try {
      const updateData = {
        name,
        user_weight: weight,
        user_height: height,
        user_body_pain: mapPainValuesToAPI(painValues),
      };
      
      console.log('📝 [SignupWizard] Calling updateUser API...');
      const result = await updateUser(userId, updateData);
      console.log('✅ [SignupWizard] updateUser returned:', JSON.stringify(result, null, 2));

      if (result.success) {
        console.log('🎉 [SignupWizard] Profile updated successfully!');
        // Create session now that profile is complete
        const phoneNumber = formValues[5]?.trim();
        if (phoneNumber) {
          const sessionToken = btoa(JSON.stringify({
            phoneNumber: phoneNumber,
            authenticatedAt: Date.now(),
          }));
          signIn(sessionToken);
          console.log('✅ [SignupWizard] Session created after profile update');
          // Redirect to home after session is created
          router.replace('/');
        }
        return true;
      } else {
        console.log('⚠️  [SignupWizard] Update failed:', result.error);
        setError(result.error || 'خطا در بروزرسانی پروفایل');
        Alert.alert('خطا', result.error || 'خطا در بروزرسانی پروفایل');
        return false;
      }
    } catch (err) {
      console.error('❌ [SignupWizard] Exception in handleUpdateProfile:', err);
      setError('خطا در بروزرسانی پروفایل');
      Alert.alert('خطا', 'خطا در بروزرسانی پروفایل');
      return false;
    } finally {
      setIsLoading(false);
      console.log('⏹️  [SignupWizard] Loading ended');
    }
  };

  const handleNext = async () => {
    if (!canGoNext && currentStepId !== 9) return;

    // Step 4 (Phone) -> Step 5 (OTP): Request OTP
    if (currentStepId === 4) {
      const success = await handleRequestOTP();
      if (!success) return;
    }

    // Step 5 (OTP) -> Step 6 (Name): Verify OTP
    if (currentStepId === 5) {
      const success = await handleVerifyOTP();
      if (!success) return;
    }

    // Step 9 (Pain) - Last step: Update user profile and redirect
    if (currentStepId === 9) {
      const success = await handleUpdateProfile();
      if (success) {
        console.log('✅ [SignupWizard] Form completed - redirecting to home');
        router.replace('/');
      }
      return;
    }

    setCurrentStepIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (!canGoPrev) return;
    setError(null);
    setCurrentStepIndex((prev) => prev - 1);
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    return handleRequestOTP();
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

    const isValid = isCurrentValid();
    
    const baseProps = {
      value,
      onChange: (val: string) => handleValueChange(step.id, val),
      onEnter: handleNext,
      disabled: isLoading,
      isValid,
      allFormValues: formValues,
      currentStepId,
      error,
      isLoading,
      onResendOTP: step.id === 5 ? handleResendOTP : undefined,
    };
    
    const content = step.isImageStep ? (
      <StepComponent
        {...baseProps}
        stepNumber={step.stepNumber}
      />
    ) : (
      <StepComponent {...baseProps} />
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
                    disabled={isLoading}
                    className="h-12 w-12 items-center justify-center rounded-full active:opacity-70"
                    style={{ 
                      backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                      opacity: isLoading ? 0.5 : 1,
                    }}
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
