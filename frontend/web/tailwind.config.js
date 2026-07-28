export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-950': 'var(--bg-primary)',
        'slate-900': 'var(--bg-secondary)',
        'accent-blue': '#2563EB',
        'accent-gray': '#4B5563',
        'glass': {
          DEFAULT: 'var(--glass-bg)',
          border: 'var(--glass-border)',
        },
      },
      boxShadow: {
        'premium': '0 8px 32px rgba(0,0,0,0.08)',
        'premium-lg': '0 12px 48px rgba(0,0,0,0.06)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
