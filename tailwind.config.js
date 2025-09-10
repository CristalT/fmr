import scrollbarPlugin from 'tailwind-scrollbar'

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [
    scrollbarPlugin,
    function ({ addBase }) {
      addBase({
        html: {
          fontSize: '11pt',
        },
        body: {
          color: '#333',
        },
      })
    },
  ],
  content: ['./inertia/**/*.{html,js,vue}'],
  theme: {
    extend: {
      colors: {
        'primary-admin': '#2563eb',
        'secondary-admin': '#43ab03',
        'tertiary-admin': '#fecc01',
        'primary': '#023285',
        'secondary': '#43ab03',
        'tertiary': '#fecc01',
        'logo': '#f7f7f7', // logo background color
      },
    },
  },
}
