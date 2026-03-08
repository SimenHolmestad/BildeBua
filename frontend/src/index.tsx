import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './utils/apiClient';
import App from './App';
import { GlobalErrorProvider } from './contexts/GlobalErrorContext';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container missing in index.html');
}
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GlobalErrorProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GlobalErrorProvider>
  </React.StrictMode>
);
