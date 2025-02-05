import { Meta, StoryObj } from '@storybook/react';

import { InputPasswordBase } from './InputPasswordBase';

const meta = {
  title: 'UI/InputPasswordBase',
  component: InputPasswordBase,
  args: {
    size: 'md',
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof InputPasswordBase>;

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
