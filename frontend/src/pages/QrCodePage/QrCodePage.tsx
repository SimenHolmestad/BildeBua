import React from 'react';
import Header from 'components/Header';
import NotFound from 'components/NotFound';
import { useQrCodes } from 'hooks/swr';

const QrCodePage = () => {
  const { qrCodes, isLoading } = useQrCodes();

  if (isLoading && !qrCodes) {
    return (
      <>
        <Header />
        <div className="flex min-h-[90vh] items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-base-300 border-t-base-700" />
        </div>
      </>
    );
  }

  if (!qrCodes) {
    return (
      <>
        <Header />
        <NotFound />
      </>
    );
  }

  const qrCodeData = qrCodes.qr_codes ?? [];

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[90vh] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 md:grid-cols-2">
          {qrCodeData.map((qrCode) => (
            <article key={qrCode.name} className="rounded-2xl border border-base-200 bg-base-50 p-6 shadow-soft">
              <img src={qrCode.url} alt={qrCode.name} className="mx-auto w-full max-w-sm" />
              <p className="mt-4 text-center text-lg font-semibold text-base-900">{qrCode.information}</p>
            </article>
          ))}
        </div>
      </main>
    </>
  );
};

export default QrCodePage;
