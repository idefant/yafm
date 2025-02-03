import { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Unchecked: Story = {
  args: {
    defaultChecked: false,
  },
};

export const WithLabel: Story = {
  args: {
    children: 'Checkbox label',
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledWithLabel: Story = {
  args: {
    disabled: true,
    children: 'Checkbox label',
  },
};

export const CheckedWithError: Story = {
  args: {
    defaultChecked: true,
    error: true,
  },
};

export const UncheckedWithError: Story = {
  args: {
    defaultChecked: false,
    error: true,
  },
};

export const DisabledCheckedWithError: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
    error: true,
  },
};

export const DisabledUncheckedWithError: Story = {
  args: {
    disabled: true,
    defaultChecked: false,
    error: true,
  },
};
