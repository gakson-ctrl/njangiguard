/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B7A43',
        danger:  '#D32F2F',
        warning: '#F57C00',
        neutral: '#F5F5F5',
        ussd:    '#1A237E',
        ink:     '#1A1A1A',
      },
    },
  },
  plugins: [],
};
