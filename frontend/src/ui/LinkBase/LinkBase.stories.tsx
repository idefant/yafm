import { Meta, StoryObj } from '@storybook/react';

import { LinkBase } from './LinkBase';

const meta = {
  title: 'UI/LinkBase',
  component: LinkBase,
  parameters: {
    layout: 'centered',
  },
  args: { children: 'Link' },
} satisfies Meta<typeof LinkBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    to: '/home',
  },
};

export const External: Story = {
  args: {
    to: 'https://example.org',
    target: '_blank',
  },
};
