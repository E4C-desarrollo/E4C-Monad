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
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        monad: {
          purple: {
            DEFAULT: '#6E54FF',
            hover: '#7259EA',
            light: '#DDD7FE',
            bright: '#8270FF',
            text: '#6347FF',
            deep: '#200052'
          },
          berry: {
            DEFAULT: '#A0055D',
            bright: '#FF8EE4'
          },
          cyan: '#85E6FF',
          sky: '#B9E3F9',
          orange: '#FFAE45',
          void: '#05060A',
          surface: '#0F0F12',
          card: '#16161A',
          'off-white': '#FBFAF9',
          'off-black': '#0A0A0A'
        }
      },
      fontFamily: {
        heading: ['"Britti Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'ui-monospace', 'monospace']
      }
    },
  },
  plugins: [],
}
