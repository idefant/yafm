import { Meta, StoryObj } from '@storybook/react';

import { Popup } from './Popup';

/**
 * Базовый компонент всплывающих окон.
 */

const meta: Meta<typeof Popup> = {
  title: 'UI/Popup',
  component: Popup,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Popup>;

export const Default: Story = {
  args: {
    isOpen: true,
    children: 'Portal children',
    disablePortal: true,
  },
};
