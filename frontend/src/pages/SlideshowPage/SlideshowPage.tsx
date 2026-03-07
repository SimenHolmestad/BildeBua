import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import AlbumEmptyMessage from 'components/AlbumEmptyMessage';
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

  const imageUrls = albumInfo?.image_urls ?? [];

  if (imageUrls.length === 0) {
    return <AlbumEmptyMessage />;
  }

  return (
    <Slideshow imageUrls={imageUrls} />
  );
};

export default SlideshowPage;
