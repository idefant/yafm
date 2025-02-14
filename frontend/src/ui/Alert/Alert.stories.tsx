import { Meta, StoryObj } from '@storybook/react';

import { Alert } from './Alert';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  args: {
    title: 'Alert sample title',
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis accusantium quia quaerat minus reprehenderit ab itaque repellendus quam accusamus! Animi sapiente ab beatae error ipsum sed ut dignissimos quae dolorem.',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Success: Story = {
  args: {
    color: 'success',
  },
};

export const Danger: Story = {
  args: {
    color: 'danger',
  },
};

export const OnlyText: Story = {
  args: {
    title: undefined,
  },
};

export const OnlyTitle: Story = {
  args: {
    text: undefined,
  },
};
