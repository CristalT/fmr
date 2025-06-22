/** @type {import('tailwindcss').Config} */
export default {
  content: ['./inertia/**/*.{html,js,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#023285',
        secondary: '#43ab03',
        tertiary: '#fecc01',
        logo: '#f7f7f7', // logo background color
      },
    },
  },
}
