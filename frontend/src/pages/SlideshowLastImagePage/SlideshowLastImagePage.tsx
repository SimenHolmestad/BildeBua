import React from 'react';
import SlideshowPage from 'pages/SlideshowPage/SlideshowPage';
import LastImage from 'components/LastImage';
import { useParams } from 'react-router-dom';
import { useRedirectOnForcedAlbumChange } from 'hooks/swr';
import routes from 'routes';

const SlideshowLastImagePage = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const { adminConfig, isRedirecting } = useRedirectOnForcedAlbumChange(routes.slideshowLastImagePage);
  const overlayTime = (adminConfig?.display.overlay_seconds ?? 20) * 1000;

  return (
    <>
      <SlideshowPage />
      {!isRedirecting && <LastImage albumName={albumName} overlay={true} overlayTime={overlayTime} />}
    </>
  );
};

export default SlideshowLastImagePage;
