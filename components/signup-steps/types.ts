export interface StepComponentProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  isValid?: boolean; // Validation state for the current step
  allFormValues?: Record<number, string>;
  currentStepId?: number; // Add current step ID for pagination
  error?: string | null; // Error message from API
  isLoading?: boolean; // Loading state during API calls
  onResendOTP?: () => Promise<boolean>; // Resend OTP function (for OTPStep)
}
