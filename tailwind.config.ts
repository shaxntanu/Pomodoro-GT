import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['VT323', 'monospace'],
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'twinkle': 'twinkle 3s infinite alternate',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 255, 255, 0.4)' },
          '50%': { textShadow: '0 0 30px rgba(255, 255, 255, 1), 0 0 40px rgba(255, 255, 255, 0.8)' },
        },
        twinkle: {
          from: { opacity: '0.05', transform: 'scale(1)' },
          to: { opacity: '0.25', transform: 'scale(1.5)' },
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}

export default config
