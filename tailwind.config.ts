import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk Variable"', '"Inter Variable"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: '#0E1726',
        muted: '#667085',
        faint: '#98A2B3',
        canvas: '#F6F7F9',
        surface: '#FFFFFF',
        hairline: '#EAECF0',
        brand: { DEFAULT: '#4338CA', soft: '#EEF0FF' },
        ok: '#17B26A',
        warn: '#F79009',
        bad: '#F04438',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.03)',
      },
    },
  },
  plugins: [],
} satisfies Config;
