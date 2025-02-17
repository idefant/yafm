import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { configureChartJS } from '#configs/chartjs';
import { configureDayjs } from '#configs/dayjs';
import { configureZod } from '#configs/zod';
import { store } from '#store';
import { DialogModalContainer } from '#ui/Modal';
import { ScrollLockWatcher } from '#ui/ScrollLock';

import App from './App';

import 'modern-normalize/modern-normalize.css';
import '@fontsource-variable/open-sans';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/index.scss';
import './styles/global.scss';
import './styles/themes/dark.scss';

configureZod();
configureChartJS();
configureDayjs();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <DialogModalContainer />
        <ScrollLockWatcher />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
