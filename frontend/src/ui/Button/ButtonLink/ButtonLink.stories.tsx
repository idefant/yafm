import SettingsIcon from '#svg/settings.svg?react';

import { ButtonLink } from './ButtonLink';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Button.Link',
  component: ButtonLink,
  parameters: {
    layout: 'centered',
  },
  args: { to: 'https://example.org', target: '_blank', children: 'Button' },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

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

export const SmallWithStartIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'sm',
    startIcon: <SettingsIcon />,
  },
};

export const MediumWithStartIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'md',
    startIcon: <SettingsIcon />,
  },
};

export const LargeWithStartIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'lg',
    startIcon: <SettingsIcon />,
  },
};

export const SmallWithEndIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'sm',
    endIcon: <SettingsIcon />,
  },
};

export const MediumWithEndIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'md',
    endIcon: <SettingsIcon />,
  },
};

export const LargeWithEndIcon: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'lg',
    endIcon: <SettingsIcon />,
  },
};
