import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import FullscreenImage from './FullscreenImage';
import NotFound from './NotFound';
import { useAlbumLastImage } from 'hooks/swr';

type LastImageProps = {
  overlay?: boolean;
  overlayTime?: number;
};

const LastImage = ({ overlay = false, overlayTime }: LastImageProps) => {
  const { albumLastImage, isLoading } = useAlbumLastImage(1500);

  if (isLoading && !albumLastImage && !overlay) {
    return <CircularProgress />;
  }

  if (!albumLastImage) {
    if (!overlay) {
      return <NotFound />;
    }
    return null;
  }

  return (
    <FullscreenImage imageUrl={albumLastImage.last_image_url} time={overlayTime} startHided={overlay} />
  );
};

export default LastImage;
