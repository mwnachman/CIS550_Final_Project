import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  lightBlue: {
    backgroundColor: '#5AA2BE',
  },
  title: {
    color: '#1A1628',
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}))

export default useStyles
