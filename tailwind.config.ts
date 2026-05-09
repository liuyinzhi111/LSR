import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f5f5f3',
        ink: '#0a0a0a',
        muted: 'rgba(10,10,10,0.58)',
        accent: '#ff8640',
        'border-card': 'rgba(10,10,10,0.10)',
        'border-hover': 'rgba(10,10,10,0.25)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
