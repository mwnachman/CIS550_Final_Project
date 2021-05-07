import { createMuiTheme } from '@material-ui/core'
import RubikMonoOne from './fonts/RubikMonoOne-Regular.ttf';
 
const rubik = {
 fontFamily: 'Rubik Mono One',
 fontDisplay: 'swap',
 src: `
   local('RubikMonoOne'),
   url(${RubikMonoOne}) format('ttf')
 `,
 unicodeRange:
   'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
}

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  typography: {
    fontFamily: ["Roboto", "RubikMonoOne", "sans-serif"].join(','),
  }
})

export default theme
