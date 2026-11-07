/* Remo Students Relief Foundation — shared Tailwind theme */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F7F3',
          100: '#DFEEE5',
          200: '#C0DDCB',
          300: '#94C4A8',
          400: '#61A581',
          500: '#3C865E',
          600: '#2A6B4A',
          700: '#1F563C',
          800: '#12452F',
          900: '#0A4D2E',
          950: '#06341F',
          DEFAULT: '#0A4D2E'
        },
        gold: {
          50: '#FBF6E9',
          100: '#F6EBCE',
          200: '#EDD79C',
          300: '#E3C065',
          400: '#D9AB3B',
          500: '#D4A017',
          600: '#C69A2C',
          700: '#9A7418',
          800: '#7A5B12',
          900: '#5C440E',
          DEFAULT: '#C69A2C'
        },
        cream: '#FBF8F0',
        ink: '#12231A',
        muted: '#5E6F64'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif']
      },
      boxShadow: {
        soft: '0 18px 45px -24px rgba(6, 52, 31, 0.28)',
        lift: '0 34px 70px -34px rgba(6, 52, 31, 0.40)'
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem'
      },
      maxWidth: {
        '8xl': '90rem'
      }
    }
  }
};
