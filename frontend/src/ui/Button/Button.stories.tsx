import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContainedPrimary: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
  },
};

export const ContainedSecondary: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'secondary',
  },
};

export const ContainedSuccess: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'success',
  },
};

export const ContainedDanger: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'danger',
  },
};

export const ContainedDisabled: Story = {
  args: {
    children: 'Button',
    variant: 'contained',
    color: 'primary',
    disabled: true,
  },
};

export const OutlinedPrimary: Story = {
  args: {
    children: 'Button',
    variant: 'outlined',
    color: 'primary',
  },
};

export const OutlinedSecondary: Story = {
  args: {
    children: 'Button',
    variant: 'outlined',
    color: 'secondary',
  },
};

export const OutlinedSuccess: Story = {
  args: {
    children: 'Button',
    variant: 'outlined',
    color: 'success',
  },
};

export const OutlinedDanger: Story = {
  args: {
    children: 'Button',
    variant: 'outlined',
    color: 'danger',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    children: 'Button',
    variant: 'outlined',
    color: 'primary',
    disabled: true,
  },
};
