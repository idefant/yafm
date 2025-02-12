import { Meta, StoryObj } from '@storybook/react';

import { BasicExample } from './examples/Basic.example';
import BasicExampleCode from './examples/Basic.example?raw';
import { GroupingExample } from './examples/Grouping.example';
import GroupingExampleCode from './examples/Grouping.example?raw';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Basic: Story = {
  render: (args) => <BasicExample {...args} />,
  parameters: {
    docs: {
      source: {
        code: BasicExampleCode,
        language: 'tsx',
      },
    },
  },
};

export const Grouping: Story = {
  render: (args) => <GroupingExample {...args} />,
  parameters: {
    docs: {
      source: {
        code: GroupingExampleCode,
        language: 'tsx',
      },
    },
  },
};
