/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/views/**/*.hbs',
    './app/assets/js/**/*{.ts, .js}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}

