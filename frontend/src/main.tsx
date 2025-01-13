import { Chart } from 'chart.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { onSigninCallback, userManager } from '#config/authConfig';
import { store } from '#store';

import App from './App';
import { ProtectedApp } from './ProtectedApp';

import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/source-sans-pro/700.css';

import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

Chart.defaults.animation = { duration: 600 };

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
        <BrowserRouter>
          <ProtectedApp>
            <App />
          </ProtectedApp>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);
