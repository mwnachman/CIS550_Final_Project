import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    minHeight: '300px',
    minWidth: '100%',
    display: '-webkit-box',
  },
  headers: {
    fontSize: 22,
    color: '#5c5855',
    fontWeight: 'bold'
  },
  paper: {
    minWidth: '60%',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

export default useStyles
