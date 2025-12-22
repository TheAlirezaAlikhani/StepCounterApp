/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './screens/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'oklch(55.8% 0.288 302.321)',
          foreground: 'oklch(0.985 0 0)',
          light: '#F3E8FF',
        },
        secondary: {
          DEFAULT: 'oklch(0.967 0.001 286.375)',
          foreground: 'oklch(0.21 0.006 285.885)',
        },
        muted: {
          DEFAULT: 'oklch(0.967 0.001 286.375)',
          foreground: 'oklch(0.552 0.016 285.938)',
        },
        accent: {
          DEFAULT: 'oklch(0.967 0.001 286.375)',
          foreground: 'oklch(0.21 0.006 285.885)',
        },
        destructive: 'oklch(0.577 0.245 27.325)',
        border: 'oklch(0.92 0.004 286.32)',
        input: 'oklch(0.92 0.004 286.32)',
        ring: 'oklch(0.705 0.015 286.067)',
        background: {
          DEFAULT: 'oklch(1 0 0)',
          light: '#FFFFFF',
          dark: '#121212',
          surface: {
            light: '#F8FAFC',
            dark: 'oklch(0.21 0.006 285.885)',
          },
        },
        foreground: 'oklch(0.141 0.005 285.823)',
        card: {
          DEFAULT: 'oklch(1 0 0)',
          foreground: 'oklch(0.141 0.005 285.823)',
        },
        popover: {
          DEFAULT: 'oklch(1 0 0)',
          foreground: 'oklch(0.141 0.005 285.823)',
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
        sans: ['Estedad', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
