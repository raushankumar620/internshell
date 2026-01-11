import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// assets
import 'assets/scss/style.scss';

// floating label fix
import 'utils/floatingLabelFix.js';

// third party
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// google oauth
import { GoogleOAuthProvider } from '@react-oauth/google';

// project import
import App from 'layout/App';
import reducer from 'store/reducer';
import * as serviceWorker from 'serviceWorker';
import { ensurePageStartsFromTop } from 'utils/scrollToTop';

// Ensure app always starts from top
ensurePageStartsFromTop();

const store = configureStore({ reducer });

const root = createRoot(document.getElementById('root'));

// ==============================|| MAIN - REACT DOM RENDER  ||==============

root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>
);

serviceWorker.unregister();