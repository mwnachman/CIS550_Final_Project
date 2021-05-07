import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  appbar: {
    backgroundColor: '#FFFFFF',
  },
  bar: {
    backgroundImage: 'url("../assets/albums_background.jpg")',
    backgroundPosition: 'left 800px',
    opacity: 0.5,
    height: 120,
    fontSize: '36px',
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}))

export default useStyles
