import { Meta, StoryObj } from '@storybook/react';

import { InputHelperText } from './InputHelperText';

const meta = {
  title: 'UI/InputHelperText',
  component: InputHelperText,
  args: {},
} satisfies Meta<typeof InputHelperText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Sample helper text',
  },
};

export const Error: Story = {
  args: {
    children: 'Sample error text',
    isError: true,
  },
};
