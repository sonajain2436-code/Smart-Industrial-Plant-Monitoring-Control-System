/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        industrial: {
          darkNavy: '#101B2D',
          navyLight: '#182740',
          navyLighter: '#223456',
          blue: '#2563EB',
          blueHover: '#1D4ED8',
          bgLight: '#F3F5F9',
          cardLight: '#FFFFFF',
          success: '#16A34A',
          warning: '#F59E0B',
          critical: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 6s linear infinite',
        'spin-medium': 'spin 3s linear infinite',
        'spin-fast': 'spin 0.8s linear infinite',
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow': 'flow 1.5s linear infinite',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
