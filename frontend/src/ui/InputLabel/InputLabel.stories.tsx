import { Meta, StoryObj } from '@storybook/react';

import { InputLabel } from './InputLabel';

const meta = {
  title: 'UI/InputLabel',
  component: InputLabel,
  args: {},
} satisfies Meta<typeof InputLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label',
  },
};

export const Required: Story = {
  args: {
    children: 'Label',
    required: true,
  },
};

export const Long: Story = {
  args: {
    children:
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odio est assumenda sed in voluptatem laboriosam ab eos labore aperiam quos quae quasi maxime placeat non, ut inventore dolores cupiditate alias?',
    required: true,
  },
};
