import { Meta, StoryObj } from '@storybook/react';

import { InputBase } from './InputBase';

const meta = {
  title: 'UI/InputBase',
  component: InputBase,
  args: {
    size: 'md',
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof InputBase>;

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
    prefix: '$',
  },
};

export const WithSuffix: Story = {
  args: {
    suffix: 'kg',
  },
};

export const DisabledWithPrefixSuffix: Story = {
  args: {
    disabled: true,
    prefix: 'Weight:',
    suffix: 'kg',
    value: 'test',
  },
};
