import { Meta, StoryObj } from '@storybook/react';

import { Title } from './Title';

const meta = {
  title: 'UI/Typography/Title',
  component: Title,
  args: {},
} satisfies Meta<typeof Title>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Level1: Story = {
  args: { level: 1, children: 'Title. Level 1' },
};

export const Level2: Story = {
  args: { level: 2, children: 'Title. Level 2' },
};

export const Level3: Story = {
  args: { level: 3, children: 'Title. Level 3' },
};

export const Level4: Story = {
  args: { level: 4, children: 'Title. Level 4' },
};

export const Level5: Story = {
  args: { level: 5, children: 'Title. Level 5' },
};

export const Level6: Story = {
  args: { level: 6, children: 'Title. Level 6' },
};

export const AsHeader: Story = {
  args: { level: 3, as: 'h3', children: 'Title. Level 3. As h3' },
};
