import { theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(6),
    marginTop: theme.spacing(2),
  },
  exterior_grid: {
    minHeight: '70vh'
  },
  interior_grid: {
    minWidth: '80%'
  },
  media: {
    height: 250,
  },
  formControl: {
    margin: 10,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: 10,
  }
}))

export default useStyles
