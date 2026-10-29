/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soft: {
          bg: '#F7FAFE',
          section: '#EDF4FD',
          card: '#FFFFFF',
          text: '#14213D',
          muted: '#52607A',
          accent: '#246BFD',
          accentHover: '#1858DF',
          surface: '#EDF4FD',
          surfaceLight: '#E7F0FF',
          border: '#D8E5F8',
          btnPrimary: '#246BFD',
          btnPrimaryText: '#FFFFFF',
          btnSecondary: '#FFFFFF',
          btnSecondaryText: '#14213D',
        },
        'dark-soft': {
          bg: '#0B0F17',
          section: '#111827',
          card: '#161F30',
          text: '#F8FAFC',
          muted: '#94A3B8',
          accent: '#3B82F6',
          accentHover: '#60A5FA',
          border: '#1E293B',
        },
        'accent-blue': '#246BFD',
        'accent-gray': '#52607A',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        handwriting: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'soft-xs': '0 1px 2px rgba(20, 33, 61, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'soft-sm': '0 2px 6px -1px rgba(20, 33, 61, 0.05), 0 1px 3px -1px rgba(20, 33, 61, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'soft': '0 6px 16px -2px rgba(20, 33, 61, 0.06), 0 2px 6px -1px rgba(20, 33, 61, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'soft-md': '0 10px 24px -4px rgba(20, 33, 61, 0.07), 0 4px 10px -2px rgba(20, 33, 61, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        'soft-lg': '0 18px 36px -6px rgba(20, 33, 61, 0.09), 0 6px 16px -3px rgba(20, 33, 61, 0.04), inset 0 1px 0 rgba(255, 255, 255, 1)',
        'soft-3d': '0 12px 28px -4px rgba(20, 33, 61, 0.08), 0 4px 10px -2px rgba(20, 33, 61, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1)',
        'soft-3d-hover': '0 20px 38px -6px rgba(20, 33, 61, 0.12), 0 8px 16px -3px rgba(36, 107, 253, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1)',
        'btn-3d': '0 4px 14px 0 rgba(36, 107, 253, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
      },
    },
  },
  plugins: [],
}