import { Meta, StoryObj } from '@storybook/react';

import { Paragraph } from './Paragraph';

const meta = {
  title: 'UI/Typography/Paragraph',
  component: Paragraph,
  args: {
    children:
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi cupiditate voluptatibus asperiores aliquam. Similique, blanditiis, accusantium ex totam molestiae obcaecati fuga soluta iste quis aliquid magni, accusamus laudantium nam et.',
  },
  render: (props) => (
    <>
      <Paragraph gutterBottom {...props} />
      <Paragraph gutterBottom {...props} />
      <Paragraph {...props} />
    </>
  ),
} satisfies Meta<typeof Paragraph>;
export default meta;
type Story = StoryObj<typeof meta>;

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

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    color: 'danger',
  },
};

export const AlignLeft: Story = {
  args: {
    align: 'left',
  },
};

export const AlignCenter: Story = {
  args: {
    align: 'center',
  },
};

export const AlignRight: Story = {
  args: {
    align: 'right',
  },
};
