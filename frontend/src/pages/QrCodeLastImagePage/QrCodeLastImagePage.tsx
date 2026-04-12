import React from 'react';
import QrCodePage from 'pages/QrCodePage/QrCodePage';
import LastImage from 'components/LastImage';
import { useAdminConfig } from 'hooks/swr';

const QrCodeLastImagePage = () => {
  const { adminConfig } = useAdminConfig(5000);
  const overlayTime = (adminConfig?.display.overlay_seconds ?? 20) * 1000;

  return (
    <>
      <LastImage overlay={true} overlayTime={overlayTime} />
      <QrCodePage />
    </>
  );
};

export default QrCodeLastImagePage;
