import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
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
    minWidth: '80%'
  },
  header: {
    fontSize: 22,
    color: '#5c5855',
  },
  media: {
    height: 140,
  },
  search: {
    color: '#1A1628',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: fade(theme.palette.common.white, 0.25),
    // '&:hover': {
    //   backgroundColor: fade(theme.palette.common.white, 0.35),
    // },
    marginLeft: theme.spacing(0),
    // width: '100%',
    // [theme.breakpoints.up('sm')]: {
    //   marginLeft: theme.spacing(3),
    //   width: 'auto',
    // },
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
  },
  radio: {
  },
  paper: {
    width: 225,
    marginTop: 2,
  }
}))

export default useStyles
