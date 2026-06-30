/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: 'var(--accent-color)',
        'accent-text': 'var(--accent-text-color)',
        surface: {
          DEFAULT: '#080B12',
          darker: '#05070B',
          nav: '#0B111A',
          card: '#10151E',
          border: '#1F2937',
          hover: '#121821',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#64748B',
          dim: '#334155',
        },
        brand: {
          orange: '#FFB86B',
          coral: '#FF553D',
          amber: '#F97316',
          peach: '#FDBA74',
        },
      },
      fontFamily: {
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['5.5rem', { lineHeight: '1', fontWeight: '900' }],
        'display-lg': ['3.75rem', { lineHeight: '1.05', fontWeight: '900' }],
        'display-md': ['2.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-sm': ['2rem', { lineHeight: '1.15', fontWeight: '800' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      minHeight: {
        'screen-dynamic': ['100vh', '100dvh'],
      },
    },
  },
  plugins: [],
};
