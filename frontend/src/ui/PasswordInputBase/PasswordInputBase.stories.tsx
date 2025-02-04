import { Meta, StoryObj } from '@storybook/react';

import { PasswordInputBase } from './PasswordInputBase';

const meta = {
  title: 'UI/PasswordInputBase',
  component: PasswordInputBase,
  args: {
    size: 'md',
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof PasswordInputBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    error: true,
  },
};

export const WithPrefix: Story = {
  args: {
    prefix: 'Password:',
  },
};

export const DisabledWithPrefix: Story = {
  args: {
    disabled: true,
    prefix: 'Password:',
    value: 'test',
  },
};
