import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ButtonBase } from './ButtonBase';

const meta = {
  title: 'UI/ButtonBase',
  component: ButtonBase,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn(), children: 'Button' },
} satisfies Meta<typeof ButtonBase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContainedPrimary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
  },
};

export const ContainedSecondary: Story = {
  args: {
    variant: 'contained',
    color: 'secondary',
  },
};

export const ContainedDefault: Story = {
  args: {
    variant: 'contained',
    color: 'default',
  },
};

export const ContainedSuccess: Story = {
  args: {
    variant: 'contained',
    color: 'success',
  },
};

export const ContainedDanger: Story = {
  args: {
    variant: 'contained',
    color: 'danger',
  },
};

export const ContainedDisabled: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    disabled: true,
  },
};

export const OutlinedPrimary: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
  },
};

export const OutlinedSecondary: Story = {
  args: {
    variant: 'outlined',
    color: 'secondary',
  },
};

export const OutlinedDefault: Story = {
  args: {
    variant: 'outlined',
    color: 'default',
  },
};

export const OutlinedSuccess: Story = {
  args: {
    variant: 'outlined',
    color: 'success',
  },
};

export const OutlinedDanger: Story = {
  args: {
    variant: 'outlined',
    color: 'danger',
  },
};

export const OutlinedDisabled: Story = {
  args: {
    variant: 'outlined',
    color: 'primary',
    disabled: true,
  },
};

export const TextPrimary: Story = {
  args: {
    variant: 'text',
    color: 'primary',
  },
};

export const TextSecondary: Story = {
  args: {
    variant: 'text',
    color: 'secondary',
  },
};

export const TextDefault: Story = {
  args: {
    variant: 'text',
    color: 'default',
  },
};

export const TextSuccess: Story = {
  args: {
    variant: 'text',
    color: 'success',
  },
};

export const TextDanger: Story = {
  args: {
    variant: 'text',
    color: 'danger',
  },
};

export const TextDisabled: Story = {
  args: {
    variant: 'text',
    color: 'primary',
    disabled: true,
  },
};

export const Link: Story = {
  args: {
    to: '/home',
  },
};

export const ExternalLink: Story = {
  args: {
    to: 'https://example.org',
    target: '_blank',
  },
};
