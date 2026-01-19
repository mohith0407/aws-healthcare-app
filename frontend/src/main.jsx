// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';
import './index.css';

// Redux Imports
import { Provider } from 'react-redux';
import { store } from './redux/store';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. SEO Provider */}
    <HelmetProvider>
      {/* 2. Authentication State Provider */}
      <Provider store={store}>
        {/* 3. Routing Provider */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);