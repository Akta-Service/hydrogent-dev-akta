/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './routes/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4a90e2', // Brand color for Bello Diamonds
        'gold-accent': '#d4af37', // Gold for luxury aesthetic
        'neutral-gray': '#f5f5f5',
      },
      fontFamily: {
        sans: ['Lora', 'sans-serif'], // Elegant font for a jewelry store
        heading: ['Playfair Display', 'serif'],
      },
      spacing: {
        '18': '4.5rem', // Custom spacing for larger sections
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For rich text styling
  ],
};