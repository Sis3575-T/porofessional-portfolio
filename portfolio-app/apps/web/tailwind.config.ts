/* tailwind.config.ts - Web App */
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-950': '#050816',
        'slate-900': '#0f172a',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #050816 0%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
