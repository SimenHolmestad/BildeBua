import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './utils/apiClient';
import App from './App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container missing in index.html');
}
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
