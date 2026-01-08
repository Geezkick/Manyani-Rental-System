/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Manyani Theme Colors
        manyani: {
          brown: {
            DEFAULT: '#8B4513',
            50: '#f8f1e9',
            100: '#e8d4c0',
            200: '#d8b797',
            300: '#c89a6e',
            400: '#b87d45',
            500: '#8B4513', // Primary Brown
            600: '#70360f',
            700: '#56280b',
            800: '#3b1a07',
            900: '#200c04',
          },
          green: {
            DEFAULT: '#2E8B57',
            50: '#e9f7ef',
            100: '#c0e8d4',
            200: '#97d9b9',
            300: '#6eca9e',
            400: '#45bb83',
            500: '#2E8B57', // Sea Green
            600: '#257046',
            700: '#1b5534',
            800: '#123b23',
            900: '#092011',
          },
          maroon: {
            DEFAULT: '#8B0000',
            50: '#ffe9e9',
            100: '#ffc0c0',
            200: '#ff9797',
            300: '#ff6e6e',
            400: '#ff4545',
            500: '#8B0000', // Dark Red/Maroon
            600: '#700000',
            700: '#560000',
            800: '#3b0000',
            900: '#200000',
          },
          cream: {
            DEFAULT: '#FFF8F0',
            50: '#ffffff',
            100: '#fffdfb',
            200: '#fff8f0',
            300: '#ffe8d1',
            400: '#ffd8b2',
            500: '#ffc893',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'manyani': '0 4px 20px rgba(139, 69, 19, 0.15)',
        'manyani-lg': '0 10px 40px rgba(139, 69, 19, 0.2)',
      },
      backgroundImage: {
        'manyani-gradient': 'linear-gradient(135deg, #8B4513 0%, #2E8B57 100%)',
        'manyani-gradient-light': 'linear-gradient(135deg, #8B4513 0%, #2E8B57 50%, #8B0000 100%)',
      }
    },
  },
  plugins: [],
}
