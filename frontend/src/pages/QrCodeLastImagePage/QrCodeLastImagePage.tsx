import React from 'react';
import QrCodePage from 'pages/QrCodePage/QrCodePage';
import LastImage from 'components/LastImage';
import { useRedirectOnForcedAlbumChange } from 'hooks/swr';
import routes from 'routes';

const QrCodeLastImagePage = () => {
  const { adminConfig, isRedirecting } = useRedirectOnForcedAlbumChange(routes.qrCodeLastImagePage);
  const overlayTime = (adminConfig?.display.overlay_seconds ?? 20) * 1000;

  return (
    <>
      {!isRedirecting && <LastImage overlay={true} overlayTime={overlayTime} />}
      <QrCodePage />
    </>
  );
};

export default QrCodeLastImagePage;
