import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import type { Theme } from '@mui/material/styles';
import routes from 'routes';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Typography variant="h4" align="center">
        404 Ikke funnet
      </Typography>
      <Typography variant="h6" color="textSecondary" align="center">
        Kunne ikke finne dataen
      </Typography>
      <div className={classes.buttonContainer}>
        <Button component={Link} to={routes.frontPage} variant="contained" color="primary">
          Gå til forside
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
