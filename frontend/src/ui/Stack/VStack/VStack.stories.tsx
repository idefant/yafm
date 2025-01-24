import { Button } from '#ui/Button';

import { VStack } from './VStack';

import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'UI/Stack/VStack',
  component: VStack,
  tags: ['autodocs'],
  render: (props) => (
    <div style={{ border: '3px solid red', height: 200 }}>
      <VStack {...props}>
        <Button>first</Button>
        <Button size="lg">second</Button>
        <Button size="sm">third</Button>
      </VStack>
    </div>
  ),
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CustomGap: Story = {
  args: {
    gap: 24,
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
  },
};

export const JustifyStart: Story = {
  args: {
    justify: 'start',
  },
};

export const JustifyCenter: Story = {
  args: {
    justify: 'center',
  },
};

export const JustifyEnd: Story = {
  args: {
    justify: 'end',
  },
};

export const JustifySpaceBetween: Story = {
  args: {
    justify: 'spaceBetween',
  },
};

export const JustifySpaceAround: Story = {
  args: {
    justify: 'spaceAround',
  },
};

export const JustifySpaceEvenly: Story = {
  args: {
    justify: 'spaceEvenly',
  },
};

export const AlignStart: Story = {
  args: {
    align: 'start',
  },
};

export const AlignCenter: Story = {
  args: {
    align: 'center',
  },
};

export const AlignEnd: Story = {
  args: {
    align: 'end',
  },
};
