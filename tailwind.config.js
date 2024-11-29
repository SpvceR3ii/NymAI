/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'nymred': {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6b6b',
          500: '#ff3b3b',
          600: '#ed1515',
          700: '#c80d0d',
          800: '#a50f0f',
          900: '#881414',
          950: '#4b0404',
        },
        dark: {
          100: '#1a1a1a',
          200: '#1c1c1c',
          300: '#2a2a2a',
          400: '#3a3a3a',
          500: '#4a4a4a',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#fff',
            a: {
              color: '#ff3b3b',
              '&:hover': {
                color: '#ff6b6b',
              },
            },
            h1: { color: '#fff' },
            h2: { color: '#fff' },
            h3: { color: '#fff' },
            h4: { color: '#fff' },
            strong: { color: '#fff' },
            code: { color: '#ff3b3b' },
            blockquote: {
              color: '#fff',
              borderLeftColor: '#ff3b3b',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};