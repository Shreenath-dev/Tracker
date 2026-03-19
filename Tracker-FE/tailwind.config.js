/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdfaf5',
          100: '#f9f3e8',
          200: '#f2e8d0',
        },
        slate: {
          950: '#0c1220',
        },
        amber: {
          450: '#f59e0b',
        },
      },
      boxShadow: {
        card: '0 1px 3px rgba(12,18,32,0.06), 0 4px 16px rgba(12,18,32,0.08)',
        'card-hover': '0 4px 8px rgba(12,18,32,0.08), 0 12px 32px rgba(12,18,32,0.12)',
        drawer: '-4px 0 40px rgba(12,18,32,0.12)',
      },
      animation: {
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'stagger-1': 'fadeUp 0.4s 0.05s cubic-bezier(0.16,1,0.3,1) both',
        'stagger-2': 'fadeUp 0.4s 0.1s cubic-bezier(0.16,1,0.3,1) both',
        'stagger-3': 'fadeUp 0.4s 0.15s cubic-bezier(0.16,1,0.3,1) both',
        'stagger-4': 'fadeUp 0.4s 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'stagger-5': 'fadeUp 0.4s 0.25s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: 0 },
          to: { transform: 'translateX(0)', opacity: 1 },
        },
        fadeUp: {
          from: { transform: 'translateY(12px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
