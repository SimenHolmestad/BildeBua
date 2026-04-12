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
  const initialUrlRef = React.useRef<string | null>(null);
  const [overlayUrl, setOverlayUrl] = React.useState<string | null>(null);

  const currentUrl = albumLastImage?.last_image_url ?? null;

  React.useEffect(() => {
    if (!overlay || !currentUrl) return;

    if (initialUrlRef.current === null) {
      initialUrlRef.current = currentUrl;
      return;
    }

    if (currentUrl !== initialUrlRef.current) {
      initialUrlRef.current = currentUrl;
      setOverlayUrl(currentUrl);
    }
  }, [overlay, currentUrl]);

  if (overlay) {
    return <FullscreenImage imageUrl={overlayUrl} time={overlayTime} />;
  }

  if (isLoading && !albumLastImage) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-base-300 border-t-base-700" />
      </div>
    );
  }

  if (!albumLastImage) {
    return <NotFound />;
  }

  return <FullscreenImage imageUrl={albumLastImage.last_image_url} time={overlayTime} />;
};

export default LastImage;
