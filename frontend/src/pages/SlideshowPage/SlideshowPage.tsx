import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import AlbumEmptyMessage from 'components/AlbumEmptyMessage';
import NotFound from 'components/NotFound';
import Slideshow from './components/Slideshow';
import { useParams } from 'react-router-dom';
import { useAlbumInfo } from 'hooks/swr';

const SlideshowPage = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const { albumInfo, isLoading } = useAlbumInfo(30000);

  if (!albumName) {
    return <h1>ERROR: Album name is missing.</h1>;
  }

  if (isLoading && !albumInfo) {
    return <CircularProgress />;
  }

  if (!albumInfo) {
    return <NotFound />;
  }

  const images = albumInfo.images ?? [];
  const imageUrls = [...images]
    .reverse()
    .map((image) => image.image_url);

  if (imageUrls.length === 0) {
    return <AlbumEmptyMessage />;
  }

  return (
    <Slideshow imageUrls={imageUrls} />
  );
};

export default SlideshowPage;
