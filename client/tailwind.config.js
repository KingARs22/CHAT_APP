/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'primary': "rgb(33,174,235)",
        'primary-light': "rgb(176,231,255)",
        "secondary":"rgb(44,63,201)",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

