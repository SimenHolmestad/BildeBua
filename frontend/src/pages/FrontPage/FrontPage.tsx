import React from 'react';
import Card from '@mui/material/Card';
import { Link, Navigate } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Header from 'components/Header';
import Footer from 'components/Footer';
import NewAlbumDialog from './components/NewAlbumDialog';
import type { Theme } from '@mui/material/styles';
import { useAvailableAlbums } from 'hooks/swr';
import routes from 'routes';

const useStyles = makeStyles((theme: Theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  albumCardContainer: {
    paddingBottom: '20px',
    minHeight: '50vh',
  },
  card: {
    height: '100%',
    width: '100%',
    marginTop: '20px',
    paddingTop: '10px',
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2 || 8,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    backgroundImage: `linear-gradient(145deg, ${theme.palette.grey[50]}, ${theme.palette.grey[100]})`,
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
      boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
    },
  },
  albumLink: {
    textDecoration: 'inherit',
    color: 'inherit',
    textTransform: 'none',
  },
  albumLinkText: {
    fontWeight: '200',
    color: theme.palette.primary.main,
  },
  loadingGrid: {
    paddingTop: '30px',
    paddingBottom: '10px',
  },
}));

const FrontPage = () => {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { albumInfo, isLoading } = useAvailableAlbums();

  if (isLoading && !albumInfo) {
    return (
      <>
        <Header />
        <Grid container className={classes.loadingGrid} spacing={2} justifyContent="center">
          <CircularProgress />
        </Grid>
        <Footer />
      </>
    );
  }

  if (!albumInfo) {
    return (
      <>
        <Header />
        <Grid container className={classes.loadingGrid} spacing={2} justifyContent="center">
          <CircularProgress />
        </Grid>
        <Footer />
      </>
    );
  }

  if (albumInfo.forced_album) {
    return (
      <>
        <Header />
        <Navigate to={routes.albumOverview(albumInfo.forced_album)} replace />
        <Footer />
      </>
    );
  }

  const availableAlbums = albumInfo.available_albums ?? [];

  const albumList = availableAlbums.map((albumName) => (
    <Link key={albumName} to={routes.albumOverview(albumName)} className={classes.albumLink}>
      <Card className={classes.card}>
        <Typography variant="h3" align="center" color="textPrimary" className={classes.albumLinkText} paragraph>
          {albumName}
        </Typography>
      </Card>
    </Link>
  ));

  return (
    <>
      <Header />
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            Welcome to BildeBua!
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            You can use BildeBua to capture images or view already captured images. Choose one of the albums below or create a new album to start!
          </Typography>
        </Container>
      </div>
      <Container maxWidth="md" className={classes.albumCardContainer}>
        {albumList}
        <Card className={classes.card} onClick={() => setDialogOpen(true)}>
          <Typography variant="h3" align="center" color="textPrimary" className={classes.albumLinkText} paragraph>
            Create new album
          </Typography>
        </Card>
      </Container>
      <NewAlbumDialog open={dialogOpen} handleClose={() => setDialogOpen(false)} />
      <Footer />
    </>
  );
};

export default FrontPage;
