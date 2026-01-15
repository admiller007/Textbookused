import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            lineHeight: '1.75',
            fontSize: '18px',
            color: '#374151',
            a: {
              color: '#3b82f6',
              textDecoration: 'none',
              '&:hover': {
                color: '#2563eb',
                textDecoration: 'underline',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
        dark: {
          css: {
            color: '#e5e7eb',
            a: {
              color: '#60a5fa',
              '&:hover': {
                color: '#93c5fd',
              },
            },
            h1: { color: '#f9fafb' },
            h2: { color: '#f9fafb' },
            h3: { color: '#f9fafb' },
            h4: { color: '#f9fafb' },
            strong: { color: '#f9fafb' },
            code: { color: '#f9fafb' },
            blockquote: {
              color: '#d1d5db',
              borderLeftColor: '#4b5563',
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
