import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: '#FFFFFF',
  },
  bar: {
    backgroundImage: 'url("../assets/albums.png")',
    backgroundPosition: 'left 240px',
    opacity: 0.5,
    height: 120,
    fontSize: '36px',
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  typography: {
    fontFamily: 'RubikMonoOne'
  }
}))

export default useStyles
