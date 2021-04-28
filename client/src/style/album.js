import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headers: {
    fontSize: 22,
    color: '#5c5855',
    fontWeight: 'bold'
  },
  paper: {
    position:'absolute',
    display:'block',
    maxHeight:'85vh',
    width: '80%',
    overflow:'scroll',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  art: {
    width: '60vh',
    height: '60vh',
    marginBottom: theme.spacing(2)
  },
  spinner: {

  }
}))

export default useStyles
