/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#1a1a2e',
          100: '#16162a',
          200: '#121226',
          300: '#0e0e22',
          400: '#0A0A1E',
          500: '#08081a',
          600: '#060616',
          700: '#040412',
          800: '#02020e',
          900: '#00000a',
          950: '#0A0A0F',
        },
        saffron: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#E8A317',
          600: '#d4940f',
          700: '#b8800a',
          800: '#9c6c06',
          900: '#805803',
        },
        violet: {
          50: '#ede7f6',
          100: '#d1c4e9',
          200: '#b39ddb',
          300: '#9575cd',
          400: '#7e57c2',
          500: '#6A3DE8',
          600: '#5E35B1',
          700: '#4527A0',
          800: '#311B92',
          900: '#2D1B69',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-saffron': 'glowSaffron 3s ease-in-out infinite alternate',
        'glow-violet': 'glowViolet 3s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'text-reveal': 'textReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'line-grow': 'lineGrow 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowSaffron: {
          '0%': { boxShadow: '0 0 5px rgba(232,163,23,0.3), 0 0 10px rgba(232,163,23,0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(232,163,23,0.5), 0 0 30px rgba(232,163,23,0.2)' },
        },
        glowViolet: {
          '0%': { boxShadow: '0 0 5px rgba(106,61,232,0.3), 0 0 10px rgba(106,61,232,0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(106,61,232,0.5), 0 0 30px rgba(106,61,232,0.2)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        textReveal: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        lineGrow: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0A0A1E 0%, #2D1B69 25%, #0A0A1E 50%, #1a0a2e 75%, #0A0A1E 100%)',
      },
    },
  },
  plugins: [],
}
