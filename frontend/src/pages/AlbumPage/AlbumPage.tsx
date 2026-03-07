import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Header from 'components/Header';
import { useParams } from 'react-router-dom';
import Footer from 'components/Footer';
import type { Theme } from '@mui/material/styles';
import { useAlbumInfo } from 'hooks/swr';
import AlbumOverview from './components/AlbumOverview';
import ImageDetail from './components/ImageDetail';

type AlbumPageView = 'detail' | 'overview';

type AlbumPageProps = {
  view?: AlbumPageView;
};

const useStyles = makeStyles((_theme: Theme) => ({
  loadingGrid: {
    height: '80vh',
    paddingTop: '250px',
  },
}));

const AlbumPage = ({ view = 'overview' }: AlbumPageProps) => {
  const { albumName } = useParams<{ albumName: string }>();
  const { albumInfo, isLoading } = useAlbumInfo(5000);
  const [imageIndex, setImageIndex] = React.useState(1);
  const classes = useStyles();

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
        <Grid container className={classes.loadingGrid} spacing={2} justifyContent="center">
          <CircularProgress />
        </Grid>
        <Footer />
      </>
    );
  }

  const imageDetail = (
    <ImageDetail
      imageUrls={albumInfo.image_urls}
      imageIndex={imageIndex}
      setImageIndex={setImageIndex}
      albumName={albumName}
    />
  );

  const albumOverview = (
    <AlbumOverview
      albumData={albumInfo}
      setImageIndex={setImageIndex}
    />
  );

  const pageContent = view === 'detail' ? imageDetail : albumOverview;

  return (
    <>
      <Header />
      {pageContent}
      <Footer />
    </>
  );
};

export default AlbumPage;
