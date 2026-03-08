import React from 'react';
import Alert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { SWRConfig } from 'swr';
import AlbumPage from './pages/AlbumPage/AlbumPage';
import AlbumImageDetailPage from './pages/AlbumImageDetailPage/AlbumImageDetailPage';
import FrontPage from './pages/FrontPage/FrontPage';
import LastImagePage from './pages/LastImagePage/LastImagePage';
import QrCodePage from './pages/QrCodePage/QrCodePage';
import QrCodeLastImagePage from './pages/QrCodeLastImagePage/QrCodeLastImagePage';
import SlideshowLastImagePage from './pages/SlideshowLastImagePage/SlideshowLastImagePage';
import SlideshowPage from './pages/SlideshowPage/SlideshowPage';
import routes from './routes';
import { useGlobalError } from './contexts/GlobalErrorContext';

import { Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  const theme = React.useMemo(() => createTheme(), []);
  const { clearError, currentErrorMessage, showError, snackbarVersion } = useGlobalError();
  const swrConfig = React.useMemo(() => ({
    onError: (error: unknown) => {
      showError(error);
    },
  }), [showError]);

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    clearError();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
      <Snackbar
        key={snackbarVersion}
        open={Boolean(currentErrorMessage)}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <Alert severity="error" variant="filled" elevation={6}>
          {currentErrorMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default App;
