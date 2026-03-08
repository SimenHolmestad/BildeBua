import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Header from 'components/Header';
import NotFound from 'components/NotFound';
import { useParams } from 'react-router-dom';
import Footer from 'components/Footer';
import type { Theme } from '@mui/material/styles';
import { useAlbumInfo } from 'hooks/swr';
import AlbumOverview from './components/AlbumOverview';

const useStyles = makeStyles((_theme: Theme) => ({
  loadingGrid: {
    height: '80vh',
    paddingTop: '250px',
  },
}));

const AlbumPage = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const { albumInfo, isLoading } = useAlbumInfo(5000);
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
        <NotFound />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <AlbumOverview albumData={albumInfo} />
      <Footer />
    </>
  );
};

export default AlbumPage;
