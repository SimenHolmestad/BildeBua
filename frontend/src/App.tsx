import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { SWRConfig } from 'swr';
import AlbumImageDetailPage from './pages/AlbumImageDetailPage/AlbumImageDetailPage';
import AlbumPage from './pages/AlbumPage/AlbumPage';
import FrontPage from './pages/FrontPage/FrontPage';
import LastImagePage from './pages/LastImagePage/LastImagePage';
import QrCodeLastImagePage from './pages/QrCodeLastImagePage/QrCodeLastImagePage';
import QrCodePage from './pages/QrCodePage/QrCodePage';
import SlideshowLastImagePage from './pages/SlideshowLastImagePage/SlideshowLastImagePage';
import SlideshowPage from './pages/SlideshowPage/SlideshowPage';
import { useGlobalError } from './contexts/GlobalErrorContext';
import routes from './routes';

const App: React.FC = () => {
  const { clearError, currentErrorMessage, showError, snackbarVersion } = useGlobalError();
  const swrConfig = React.useMemo(
    () => ({
      onError: (error: unknown) => {
        showError(error);
      },
    }),
    [showError]
  );

  React.useEffect(() => {
    if (!currentErrorMessage) {
      return;
    }

    const timeout = setTimeout(() => {
      clearError();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [clearError, currentErrorMessage, snackbarVersion]);

  return (
    <>
      <SWRConfig value={swrConfig}>
        <Routes>
          <Route path={routes.frontPage} element={<FrontPage />} />
          <Route path={routes.qrCodePage} element={<QrCodePage />} />
          <Route path={routes.albumPage(':albumName')} element={<AlbumPage />} />
          <Route path={routes.albumImageDetailPage(':albumName', ':imageNumber')} element={<AlbumImageDetailPage />} />
          <Route path={routes.lastImagePage(':albumName')} element={<LastImagePage />} />
          <Route path={routes.qrCodeLastImagePage(':albumName')} element={<QrCodeLastImagePage />} />
          <Route path={routes.slideshowPage(':albumName')} element={<SlideshowPage />} />
          <Route path={routes.slideshowLastImagePage(':albumName')} element={<SlideshowLastImagePage />} />
          <Route path={routes.notFoundPage} element={<FrontPage />} />
          <Route path="*" element={<FrontPage />} />
        </Routes>
      </SWRConfig>
      {currentErrorMessage ? (
        <div
          key={snackbarVersion}
          className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 animate-fade-in-up rounded-xl border border-red-200 bg-red-600/95 px-4 py-3 text-sm font-semibold text-white shadow-soft"
          role="alert"
        >
          {currentErrorMessage}
        </div>
      ) : null}
    </>
  );
};

export default App;
