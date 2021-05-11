import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    position:'absolute',
    display:'block',
    maxHeight:'85vh',
    width: '90%',
    overflow:'scroll',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  exterior_grid: {
    width: '100%',
  },
  interior_grid: {
    width: '100%',
  },
}))

export default useStyles
