import { useMemo } from 'react';
import { useTheme } from '../../../hooks/theme-context';

export function useStepColors() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return useMemo(
    () => ({
      textPrimary: isDark ? '#F8FAFC' : '#0F172A',
      textMuted: isDark ? '#94A3B8' : '#64748B',
      cardBg: isDark ? '#27272A' : '#E4E4E7',
      cardBorder: isDark ? '#3F3F46' : '#D4D4D8',
      primary: '#A855F7',
    }),
    [isDark]
  );
}

