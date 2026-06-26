/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
      },
      colors: {
        'signal-black': '#0A0E1A',
        'midnight-blue': '#0F172A',
        'living-brass': '#D4A843',
        'electric-teal': '#0D9488',
        'warm-cream': '#FAF3E0',
        'bns-gray': '#8A9BB0',
      },
    },
  },
  plugins: [],
}

