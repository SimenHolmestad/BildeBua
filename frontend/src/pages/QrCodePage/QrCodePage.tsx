import React, { useMemo } from 'react';
import Header from 'components/Header';
import LastImage from 'components/LastImage';
import NotFound from 'components/NotFound';
import QrCode from 'components/QrCode';
import QrCodeBanner from 'components/QrCodeBanner';
import { useAdminConfig } from 'hooks/swr';
import { deriveQrCodes } from 'utils/qrCodeUtils';

const QR_REFRESH_INTERVAL = 5000;

const QrCodePage = ({ hideOverlay = false }: { hideOverlay?: boolean }) => {
  const { adminConfig, isLoading } = useAdminConfig(QR_REFRESH_INTERVAL);
  const forcedAlbum = adminConfig?.forced_album ?? null;
  const overlayTime = (adminConfig?.display.overlay_seconds ?? 20) * 1000;

  const qrCodeData = useMemo(() => {
    if (!adminConfig) return null;
    return deriveQrCodes(adminConfig);
  }, [adminConfig]);

  if (isLoading && !adminConfig) {
    return (
      <>
        <Header />
        <div className="flex min-h-[90vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-base-300 border-t-base-700" />
        </div>
      </>
    );
  }

  if (!qrCodeData || qrCodeData.length === 0) {
    return (
      <>
        <Header />
        <NotFound />
      </>
    );
  }

  const useCenterImages = adminConfig?.qr_codes.use_center_images ?? true;

  const bannerEnabled = (adminConfig?.banner?.enabled ?? false) && forcedAlbum != null;

  return (
    <>
      {!hideOverlay && forcedAlbum && <LastImage albumName={forcedAlbum} overlay={true} overlayTime={overlayTime} />}
      <div className={bannerEnabled ? "flex min-h-screen flex-col" : undefined}>
        <Header />
        <main
          className={
            bannerEnabled
              ? "mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-10 sm:px-6 lg:px-8"
              : "mx-auto flex min-h-[90vh] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8"
          }
        >
          <div className={`grid w-full gap-6 ${qrCodeData.length === 1 ? "max-w-lg mx-auto" : "md:grid-cols-2"}`}>
            {qrCodeData.map((descriptor) => (
              <article key={descriptor.name} className="rounded-2xl border border-base-200 bg-base-50 px-6 pb-6 pt-14 shadow-soft">
                <div className="mx-auto flex w-full justify-center">
                  <QrCode descriptor={descriptor} size={400} useCenterImage={useCenterImages} />
                </div>
                <p className="mt-4 text-center text-lg font-semibold text-base-900">{descriptor.information}</p>
              </article>
            ))}
          </div>
        </main>
        <QrCodeBanner albumName={forcedAlbum} config={adminConfig?.banner} />
      </div>
    </>
  );
};

export default QrCodePage;
