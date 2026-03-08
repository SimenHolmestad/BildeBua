import React from 'react';
import FullscreenImage from './FullscreenImage';
import NotFound from './NotFound';
import { useAlbumLastImage } from 'hooks/swr';

type LastImageProps = {
  albumName?: string;
  overlay?: boolean;
  overlayTime?: number;
};

const LastImage = ({ albumName, overlay = false, overlayTime }: LastImageProps) => {
  const { albumLastImage, isLoading } = useAlbumLastImage(albumName, 1500);

  if (isLoading && !albumLastImage && !overlay) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-base-300 border-t-base-700" />
      </div>
    );
  }

  if (!albumLastImage) {
    if (!overlay) {
      return <NotFound />;
    }
    return null;
  }

  return <FullscreenImage imageUrl={albumLastImage.last_image_url} time={overlayTime} startHided={overlay} />;
};

export default LastImage;
