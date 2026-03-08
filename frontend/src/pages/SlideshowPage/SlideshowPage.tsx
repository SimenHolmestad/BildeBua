import React from 'react';
import AlbumEmptyMessage from 'components/AlbumEmptyMessage';
import NotFound from 'components/NotFound';
import { useAlbumInfo } from 'hooks/swr';
import { useParams } from 'react-router-dom';
import Slideshow from './components/Slideshow';

const SlideshowPage = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const { albumInfo, isLoading } = useAlbumInfo(30000);

  if (!albumName) {
    return <h1 className="p-8 text-2xl font-semibold text-red-700">FEIL: Albumnavn mangler.</h1>;
  }

  if (isLoading && !albumInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-700 border-t-zinc-100" />
      </div>
    );
  }

  if (!albumInfo) {
    return <NotFound />;
  }

  const images = albumInfo.images ?? [];
  const imageUrls = [...images].reverse().map((image) => image.image_url);

  if (imageUrls.length === 0) {
    return <AlbumEmptyMessage />;
  }

  return <Slideshow imageUrls={imageUrls} />;
};

export default SlideshowPage;
