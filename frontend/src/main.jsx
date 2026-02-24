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

// Amplify Config ---
import { Amplify } from 'aws-amplify';
const COGNITO_DOMAIN = import.meta.env.VITE_COGNITO_DOMAIN;
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
Amplify.configure({
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: COGNITO_DOMAIN,
          scopes: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
          redirectSignIn: [FRONTEND_URL],  // Must match Cognito "Allowed Callback URLs"
          redirectSignOut: [FRONTEND_URL], // Must match Cognito "Allowed Sign-out URLs"
          responseType: 'code',
        }
      }
    }
  }
});
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