export interface StepComponentProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  disabled?: boolean;
  allFormValues?: Record<number, string>;
  currentStepId?: number; // Add current step ID for pagination
}
