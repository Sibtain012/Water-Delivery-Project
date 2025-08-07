/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-primary',
    'text-secondary',
    'hover:bg-accent',
    'dark:bg-background',
    'dark:text-text',
    'dark:hover:bg-accent',
    'dark:focus:ring-primary',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0C2C59',
        secondary: '#5DAE3D ',
        accent: '#1AD3D3',
        background: '#E6F3FB',
        text: '#0A1F33',
      },
      boxShadow: {
        'custom-light': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'custom-dark': '0 4px 6px rgba(0, 0, 0, 0.2)',
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xl': '1.875rem',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        custom: ['Poppins', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'], // ✅ This line fixes your font-playfair issue
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
      borderColor: ['dark'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
