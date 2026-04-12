import React from 'react';
import SlideshowPage from 'pages/SlideshowPage/SlideshowPage';
import LastImage from 'components/LastImage';
import { useParams } from 'react-router-dom';
import { useAdminConfig } from 'hooks/swr';

const SlideshowLastImagePage = () => {
  const { albumName } = useParams<{ albumName: string }>();
  const { adminConfig } = useAdminConfig(5000);
  const overlayTime = (adminConfig?.display.overlay_seconds ?? 20) * 1000;

  return (
    <>
      <SlideshowPage />
      <LastImage albumName={albumName} overlay={true} overlayTime={overlayTime} />
    </>
  );
};

export default SlideshowLastImagePage;
