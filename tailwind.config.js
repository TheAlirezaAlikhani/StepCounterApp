/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/**/*.{js,ts,tsx}'],

  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          foreground: '#FFFFFF',
          light: '#F3E8FF',
        },
        secondary: {
          DEFAULT: '#F1F5F9',
          foreground: '#0F172A',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        accent: {
          DEFAULT: '#F1F5F9',
          foreground: '#0F172A',
        },
        destructive: '#EF4444',
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#94A3B8',
        background: {
          DEFAULT: 'oklch(1 0 0)',
          light: '#FFFFFF',
          dark: '#121212',
          surface: {
            light: '#F8FAFC',
            dark: '#18181B',
          },
        },
        foreground: '#0F172A',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0F172A',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
      },
      fontFamily: {
        // Base Estedad family (uses Regular weight)
        estedad: ['Estedad-Regular'],
        // All weight variants
        'estedad-black': ['Estedad-Black'],
        'estedad-extrabold': ['Estedad-ExtraBold'],
        'estedad-bold': ['Estedad-Bold'],
        'estedad-semibold': ['Estedad-SemiBold'],
        'estedad-medium': ['Estedad-Medium'],
        'estedad-regular': ['Estedad-Regular'],
        'estedad-light': ['Estedad-Light'],
        'estedad-extralight': ['Estedad-ExtraLight'],
        // Default sans font
        sans: ['Estedad-Regular', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
