import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import SettingsIcon from '#svg/settings.svg?react';

import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: { onClick: fn(), children: 'Button' },
} satisfies Meta<typeof Button>;

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
