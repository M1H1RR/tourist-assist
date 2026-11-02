/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        surface: {
          dark: '#111827',
          card: '#1E293B',
          glass: 'rgba(30, 41, 59, 0.75)',
        },
        cyan: {
          electric: '#00F3FF',
          glow: 'rgba(0, 243, 255, 0.35)',
        },
        coral: {
          neon: '#FF0055',
          glow: 'rgba(255, 0, 85, 0.35)',
        },
        saffron: {
          DEFAULT: '#D97706',
          dark: '#B45309',
          light: '#FBBF24',
        },
        gold: {
          temple: '#B45309',
          light: '#FDE68A',
        },
        teal: {
          sacred: '#0F766E',
          light: '#2DD4BF',
        },
        emergency: {
          red: '#DC2626',
        },
        primaryText: '#FFFFFF',
        secondaryText: '#94A3B8',
        borderGlass: 'rgba(255, 255, 255, 0.12)',
      },
      fontFamily: {
        heading: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        devanagari: ['var(--font-noto-sans-devanagari)', 'Noto Sans Devanagari', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '16px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -2px rgba(0, 243, 255, 0.45)',
        'glow-coral': '0 0 20px -2px rgba(255, 0, 85, 0.45)',
        'glow-saffron': '0 0 20px -2px rgba(217, 119, 6, 0.45)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

