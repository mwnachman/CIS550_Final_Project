import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(6),
    width: '100%',
  },
  content: {
    minHeight: '300px',
    minWidth: '100%',
    display: '-webkit-box',
  },
  exterior_grid: {
    minHeight: '70vh'
  },
  interior_grid: {
    width: '90%',
  },
  headers: {
    fontSize: 22,
    color: '#5c5855',
    fontWeight: 'bold'
  },
  media: {
    height: '50vh',
  },
  search: {
    color: '#1A1628',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    border: '1px solid black',
    marginLeft: theme.spacing(0),
  },
  searchIcon: {
    color: 'gray',
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  form: {
    display: '-webkit-box',
  },
  inputTypeSearch: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '27ch',
    },
  }
}))

export default useStyles
