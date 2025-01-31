import type { Preview } from '@storybook/react';
import { themes } from '@storybook/theming';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import 'modern-normalize/modern-normalize.css';
import '@fontsource-variable/open-sans';
import '../src/styles/themes/dark.scss';
import '../src/index.scss';
import '../src/global.scss';
import { DialogModalContainer } from '../src/ui/Modal';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.dark,
    },
    backgrounds: {
      values: [
        { name: 'Dark', value: 'var(--bg)' },
        { name: 'Dark - Paper', value: 'var(--bg-paper)' },
      ],
      default: 'Dark - Paper',
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
        <DialogModalContainer />
      </BrowserRouter>
    ),
  ],
};

export default preview;
