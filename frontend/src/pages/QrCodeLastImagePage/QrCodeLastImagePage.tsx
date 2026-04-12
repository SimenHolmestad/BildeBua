import React from 'react';
import { useNavigate } from 'react-router-dom';
import QrCodePage from 'pages/QrCodePage/QrCodePage';
import LastImage from 'components/LastImage';
import { useAdminConfig, useAlbumName } from 'hooks/swr';
import routes from 'routes';

const QrCodeLastImagePage = () => {
  const { adminConfig } = useAdminConfig(5000);
  const albumName = useAlbumName();
  const navigate = useNavigate();
  const overlayTime = (adminConfig?.display.overlay_seconds ?? 20) * 1000;

  React.useEffect(() => {
    if (!adminConfig) return;
    const forcedAlbum = adminConfig.forced_album;
    if (forcedAlbum && forcedAlbum !== albumName) {
      navigate(routes.qrCodeLastImagePage(forcedAlbum), { replace: true });
    }
  }, [adminConfig, albumName, navigate]);

  return (
    <>
      <LastImage overlay={true} overlayTime={overlayTime} />
      <QrCodePage />
    </>
  );
};

export default QrCodeLastImagePage;
