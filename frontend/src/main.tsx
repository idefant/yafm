import { Chart } from 'chart.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from '#store';
import { DialogModalContainer } from '#ui/Modal';
import { ScrollLockWatcher } from '#ui/ScrollLock';

import App from './App';
import '#utils/form/schema';

import 'modern-normalize/modern-normalize.css';
import '@fontsource-variable/open-sans';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/index.scss';
import './styles/global.scss';
import './styles/themes/dark.scss';

Chart.defaults.animation = { duration: 500 };
Chart.overrides.pie.animation = { animateRotate: false, animateScale: false };
Chart.overrides.line.interaction = { intersect: false, mode: 'x' } as any;
Chart.overrides.pie.borderColor = '#000';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

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
