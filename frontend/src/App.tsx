import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AlbumPage from './pages/AlbumPage/AlbumPage';
import FrontPage from './pages/FrontPage/FrontPage';
import LastImagePage from './pages/LastImagePage/LastImagePage';
import QrCodePage from './pages/QrCodePage/QrCodePage';
import QrCodeLastImagePage from './pages/QrCodeLastImagePage/QrCodeLastImagePage';
import SlideshowLastImagePage from './pages/SlideshowLastImagePage/SlideshowLastImagePage';
import SlideshowPage from './pages/SlideshowPage/SlideshowPage';
import routes from './routes';

import { Route, Routes } from 'react-router-dom';

const App: React.FC = () => {
  const theme = React.useMemo(() => createTheme(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path={routes.home} element={<FrontPage />} />
        <Route path={routes.qr} element={<QrCodePage />} />
        <Route path={routes.albumOverview(':albumName')} element={<AlbumPage view="overview" />} />
        <Route path={routes.albumDetail(':albumName')} element={<AlbumPage view="detail" />} />
        <Route path={routes.albumLastImage(':albumName')} element={<LastImagePage />} />
        <Route path={routes.albumLastImageQr(':albumName')} element={<QrCodeLastImagePage />} />
        <Route path={routes.albumSlideshow(':albumName')} element={<SlideshowPage />} />
        <Route path={routes.albumSlideshowLastImage(':albumName')} element={<SlideshowLastImagePage />} />
        <Route path={routes.notFound} element={<FrontPage />} />
        <Route path="*" element={<FrontPage />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
