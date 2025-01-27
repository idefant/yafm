import { Meta, StoryObj } from '@storybook/react';

import { Button } from '#ui/Button';
import { Paragraph, Title } from '#ui/Typography';

import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    style: { width: 400 },
  },
  render: (props) => (
    <Card {...props}>
      <Card.Content>
        <Title level={4} gutterBottom>
          Card title
        </Title>
        <Paragraph gutterBottom>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam modi, corrupti omnis
          nisi accusantium amet aperiam iure assumenda molestias eos sapiente cum dolorum adipisci
          dignissimos sunt nemo ad culpa voluptatem.
        </Paragraph>
        <Paragraph>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam modi, corrupti omnis
          nisi accusantium amet aperiam iure assumenda molestias eos sapiente cum dolorum adipisci
          dignissimos sunt nemo ad culpa voluptatem.
        </Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button size="sm">Save</Button>
        <Button size="sm" color="secondary">
          Cancel
        </Button>
      </Card.Actions>
    </Card>
  ),
};
