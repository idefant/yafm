import { Meta, StoryObj } from '@storybook/react';

import { InputPassword } from './InputPassword';

const meta = {
  title: 'UI/InputPassword',
  component: InputPassword,
  args: {
    label: 'Label',
    size: 'md',
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof InputPassword>;

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

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
  },
};

export const WithError: Story = {
  args: {
    error: true,
  },
};

export const WithErrorText: Story = {
  args: {
    error: 'Sample error text',
  },
};

export const WithHelperText: Story = {
  args: {
    helper: 'Helper text',
  },
};
