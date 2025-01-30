import { Meta, StoryObj } from '@storybook/react';

import { TextAreaBase } from './TextAreaBase';

const meta = {
  title: 'UI/TextAreaBase',
  component: TextAreaBase,
  args: {
    size: 'md',
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof TextAreaBase>;

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
