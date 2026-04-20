import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: '#080808',
          card: '#111111',
          card2: '#161616',
          border: '#222222',
  // ── Purple (primary brand) ──
          purple: '#7B2FBE',
          'purple-dim': '#5A1F8C',
          'purple-glow':'#9D4EDD',
  // ── Gold (achievements) ──
          gold: '#FFB800',
          'gold-dim': '#7A5800',
  // ── Red (alerts/urgent) ──
          red: '#FF2200',
          'red-dim': '#991500',
  // ── Text ──
          text: '#F0F0F0',
          muted: '#888888',
          faint: '#444444',

        },
      },
      fontFamily: {
        bebas:    ['"Bebas Neue"', 'cursive'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono:     ['"Share Tech Mono"', 'monospace'],
      },
      animation: {
        scanline: 'scanline 6s linear infinite',
        fadeUp:   'fadeUp 0.7s ease forwards',
        flicker:  'flicker 8s infinite',
        rankIn:   'rankIn 0.4s ease forwards',
      },
      keyframes: {
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%':           { opacity: '0.6' },
          '98%':           { opacity: '0.9' },
        },
        rankIn: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}

export default config
