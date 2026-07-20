export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-950': 'var(--bg-primary)',
        'slate-900': 'var(--bg-secondary)',
        'glass': {
          DEFAULT: 'var(--glass-bg)',
          border: 'var(--glass-border)',
        },
        'accent': {
          DEFAULT: '#22d3ee',
          dim: 'rgba(34, 211, 238, 0.15)',
          glow: 'rgba(34, 211, 238, 0.25)',
        },
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #050816 0%, #0f172a 100%)',
        'gradient-premium': 'linear-gradient(135deg, #050816 0%, #0a0a1a 50%, #050816 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'button-glow': 'button-glow 3s ease-in-out infinite',
        'sidebar-indicator': 'sidebar-indicator 2s ease-in-out infinite',
        'badge-pulse': 'badge-pulse 3s ease-in-out infinite',
        'soft-glow': 'soft-glow 4s ease-in-out infinite',
        'river': 'river-flow 4s ease-in-out infinite',
      },
      boxShadow: {
        'premium': '0 8px 32px rgba(0,0,0,0.25)',
        'premium-lg': '0 12px 48px rgba(0,0,0,0.3)',
        'glow': '0 0 20px rgba(34, 211, 238, 0.15)',
        'glow-lg': '0 0 40px rgba(34, 211, 238, 0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
