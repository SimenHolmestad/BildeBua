import React from 'react';
import QrCodePage from 'pages/QrCodePage/QrCodePage';
import LastImage from 'components/LastImage';

const QrCodeLastImagePage = () => {
  return (
    <>
      <LastImage overlay={true} overlayTime={20000} />
      <QrCodePage />
    </>
  );
};

export default QrCodeLastImagePage
