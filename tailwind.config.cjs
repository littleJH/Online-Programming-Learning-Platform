module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  corePlugins: {
    preflight: false
  },
  variants: {
    extend: {
      overflow: ['hover']
    }
  },
  theme: {
    extend: {
      transitionProperty: {
        height: 'height'
      }
    },
    boxShadow: {
      'white-md-y': '0 4px 6px 2px rgba(255,255,255, 0.1), 0 2px 4px 2px rgba(255,255,255, 0.06)',
      'md-y': '0 4px 6px 2px rgba(0, 0, 0, 0.1), 0 2px 4px 2px rgba(0, 0, 0, 0.06)',
      'white-md': '0 4px 6px -1px rgba(255,255,255, 0.1), 0 2px 4px -1px rgba(255,255,255, 0.06)',
      'white-lg': '0 10px 15px -3px rgba(255, 255, 255, 0.1), 0 4px 6px -2px rgba(255, 255, 255, 0.05)',
      'white-2xl': '0 25px 50px -12px rgba(255, 255, 255, 0.25)',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none'
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      deepBlack: '#141414',
      shallowBlack: '#242424'
    })
  },
  plugins: [],
  darkMode: 'class'
}