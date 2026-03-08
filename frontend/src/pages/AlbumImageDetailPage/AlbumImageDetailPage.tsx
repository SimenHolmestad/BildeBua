import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import { makeStyles } from '@mui/styles';
import { Link, useParams } from 'react-router-dom';
import type { Theme } from '@mui/material/styles';
import Header from 'components/Header';
import Footer from 'components/Footer';
import NotFound from 'components/NotFound';
import { useAlbumInfo } from 'hooks/swr';
import routes from 'routes';

const useStyles = makeStyles((theme: Theme) => ({
  loadingGrid: {
    height: '80vh',
    paddingTop: '250px',
  },
  image: {
    width: '100%',
  },
  imageContainer: {
    maxWidth: '1100px',
    padding: theme.spacing(0, 0, 0),
  },
  backToAlbumButton: {
    marginTop: '4px',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  notFoundContainer: {
    minHeight: '70vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
}));

const AlbumImageDetailPage = () => {
  const classes = useStyles();
  const { albumName, imageNumber } = useParams<{ albumName: string; imageNumber: string }>();
  const { albumInfo, isLoading } = useAlbumInfo(5000);

  if (!albumName) {
    return (
      <>
        <Header />
        <h1>ERROR: Album name is missing.</h1>
        <Footer />
      </>
    );
  }

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
        <NotFound />
        <Footer />
      </>
    );
  }

  const selectedImageNumber = imageNumber && /^\d+$/.test(imageNumber)
    ? Number.parseInt(imageNumber, 10)
    : Number.NaN;
  const images = albumInfo.images;
  const selectedIndex = images.findIndex((image) => image.image_number === selectedImageNumber);
  const selectedImage = Number.isNaN(selectedImageNumber) ? null : images[selectedIndex] ?? null;

  if (selectedIndex < 0 || Number.isNaN(selectedImageNumber) || !selectedImage) {
    return (
      <>
        <Header />
        <Container className={classes.notFoundContainer}>
          <Typography variant="h4" align="center">
            Image not found
          </Typography>
          <Typography variant="h6" color="textSecondary" align="center">
            Could not find image {imageNumber} in this album.
          </Typography>
          <Button component={Link} to={routes.albumPage(albumName)} variant="contained" color="primary">
            Back to album
          </Button>
        </Container>
        <Footer />
      </>
    );
  }

  const previousImageNumber = selectedIndex > 0 ? images[selectedIndex - 1].image_number : null;
  const nextImageNumber = selectedIndex < images.length - 1 ? images[selectedIndex + 1].image_number : null;

  return (
    <>
      <Header />
      <Container className={classes.imageContainer}>
        <Button component={Link} to={routes.albumPage(albumName)} className={classes.backToAlbumButton}>
          <KeyboardArrowLeft />
          Back to album
        </Button>
        <img className={classes.image} src={selectedImage.image_url} alt="" />
        <Grid container justifyContent="space-between">
          <Button
            component={previousImageNumber !== null ? Link : 'button'}
            to={previousImageNumber !== null ? routes.albumImageDetailPage(albumName, previousImageNumber) : undefined}
            disabled={previousImageNumber === null}
          >
            <ArrowBack className={classes.leftIcon} />
            Previous image
          </Button>
          <Button
            component={nextImageNumber !== null ? Link : 'button'}
            to={nextImageNumber !== null ? routes.albumImageDetailPage(albumName, nextImageNumber) : undefined}
            disabled={nextImageNumber === null}
          >
            Next image
            <ArrowForward className={classes.rightIcon} />
          </Button>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default AlbumImageDetailPage;
