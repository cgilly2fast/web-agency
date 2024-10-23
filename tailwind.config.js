/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      screens: {
        tall: { raw: '(min-height: 797px)' },
        short: { raw: '(max-height: 796px)' },
      },
    },
  },
  plugins: [],
}
