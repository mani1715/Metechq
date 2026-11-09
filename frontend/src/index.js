import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './pages/pages.css';
import './mobile-responsive-fixes.css';
import App from './App';
import './studio-theme.css';
import './pages/ContactStudio.css';
import './pages/PortfolioStudio.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
