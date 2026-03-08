import React from 'react';
import Footer from 'components/Footer';
import Header from 'components/Header';
import NotFound from 'components/NotFound';
import { useAlbumInfo } from 'hooks/swr';
import { useParams } from 'react-router-dom';
import AlbumOverview from './components/AlbumOverview';

const AlbumPage = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const { albumInfo, isLoading } = useAlbumInfo(5000);

  if (!albumName) {
    return (
      <>
        <Header />
        <h1 className="mx-auto my-20 max-w-3xl px-4 text-2xl font-semibold text-red-700">FEIL: Albumnavn mangler.</h1>
        <Footer />
      </>
    );
  }

  if (isLoading && !albumInfo) {
    return (
      <>
        <Header />
        <div className="flex min-h-[80vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-base-300 border-t-base-700" />
        </div>
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
