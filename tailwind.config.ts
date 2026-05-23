import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-void': '#03000A',
        'bg-surface': '#0A0714',
        'bg-elevated': '#110E1F',
        'bg-border': '#1E1A35',
        'sol-purple': '#9945FF',
        'sol-green': '#14F195',
        'sol-blue': '#00C2FF',
        'sol-magenta': '#DC1FFF',
        'text-primary': '#F8F6FF',
        'text-secondary': '#A09ABF',
        'text-muted': '#5C5680',
        'text-success': '#14F195',
        'text-warning': '#FFB547',
        'text-danger': '#FF4D4D',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'Syne', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
        'gradient-hero': 'linear-gradient(135deg, #9945FF 0%, #00C2FF 50%, #14F195 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(153,69,255,0.1) 0%, rgba(20,241,149,0.05) 100%)',
        'gradient-text': 'linear-gradient(90deg, #9945FF, #14F195)',
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'marquee': 'marquee 20s linear infinite',
        'count-up': 'count-up 2s ease-out forwards',
        'progress-fill': 'progress-fill 1s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'progress-fill': {
          '0%': { width: '0%' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow-purple': '0 0 40px rgba(153,69,255,0.3)',
        'glow-green': '0 0 40px rgba(20,241,149,0.3)',
        'glow-sm': '0 0 20px rgba(153,69,255,0.2)',
        'card-hover': '0 20px 60px rgba(153,69,255,0.15)',
      },
    },
  },
  plugins: [],
}

export default config
