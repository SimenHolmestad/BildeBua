import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import type { Theme } from '@mui/material/styles';
import type { AlbumInfoResponse } from 'api';
import { captureImageToAlbumAndRefresh } from 'hooks/swr';
import routes from 'routes';
import { getApiErrorMessage } from 'utils/apiError';

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  emptyAlbumText: {
    fontWeight: '200',
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
    minHeight: '55vh',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%',
  },
}));

type AlbumOverviewProps = {
  albumData: AlbumInfoResponse;
};

const AlbumOverview = ({ albumData }: AlbumOverviewProps) => {
  const [isCapturingImage, setIsCapturingImage] = React.useState(false);
  const classes = useStyles();
  const images = albumData.images;
  const albumName = albumData.album_name;
  const albumDescription = albumData.description ?? '';
  const [errorSnackbarOpen, setErrorSnackbarOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const newestFirstImages = [...images].reverse();

  const handleErrorSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorSnackbarOpen(false);
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCapturingImage(true);

    try {
      await captureImageToAlbumAndRefresh(albumName);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
      setErrorSnackbarOpen(true);
    } finally {
      setIsCapturingImage(false);
    }
  };

  const captureButton = isCapturingImage ? (
    <CircularProgress />
  ) : (
    <Button onClick={handleClick} variant="contained" color="primary">
      <CameraIcon className={classes.icon} />
      Capture new image
    </Button>
  );

  const cardGrid = newestFirstImages.length === 0 ? (
    <Container maxWidth="sm">
      <Typography variant="h3" className={classes.emptyAlbumText} align="center" color="textSecondary" gutterBottom>
        No images :(
      </Typography>
      <Typography variant="h5" className={classes.emptyAlbumText} align="center" color="textSecondary" paragraph>
        There are currently no images in this album. Add an image by pushing the blue button above!
      </Typography>
    </Container>
  ) : (
    <Grid container spacing={4}>
      {newestFirstImages.map((imageData) => {
        return (
          <Grid item key={`${imageData.thumbnail_url}-${imageData.image_number}`} xs={12} sm={6} md={4}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image={imageData.thumbnail_url}
                title="No description provided"
              />
              <CardActions>
                <Button
                  component={Link}
                  to={routes.albumImageDetailPage(albumName, imageData.image_number)}
                  size="small"
                  color="primary"
                >
                  View in full size
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );

  return (
    <>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
            {albumName}
          </Typography>
          <Typography variant="h5" align="center" color="textSecondary" paragraph>
            {albumDescription}
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justifyContent="center">
              {captureButton}
            </Grid>
          </div>
        </Container>
      </div>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={5000} onClose={handleErrorSnackbarClose}>
        <Alert severity="error" variant="filled" elevation={6}>
          {errorMessage}
        </Alert>
      </Snackbar>
      <Container className={classes.cardGrid} maxWidth="md">
        {cardGrid}
      </Container>
    </>
  );
};

export default AlbumOverview;
