import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(6),
    width: '100%',
  },
  exterior_grid: {
    minHeight: '70vh'
  },
  interior_grid: {
    minWidth: '80%',
  },
  recsWording: {
    marginTop: theme.spacing(4)
  },
  input: {
    width: 80
  },
  slider: {
    width: 150,
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0)
  },
  description: {
    maxWidth: 250
  }
}))

export default useStyles
