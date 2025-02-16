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

export const BasicMedium: Story = {
  render: (args) => <BasicExample {...args} />,
  args: {
    fullWidth: true,
  },
  parameters: {
    docs: {
      source: {
        code: BasicExampleCode,
        language: 'tsx',
      },
    },
  },
};

export const BasicSmall: Story = {
  render: (args) => <BasicExample {...args} />,
  args: {
    fullWidth: true,
    size: 'sm',
    headTextSize: 'md',
  },
  parameters: {
    docs: {
      source: {
        code: BasicExampleCode,
        language: 'tsx',
      },
    },
  },
};

export const GroupingMedium: Story = {
  render: (args) => <GroupingExample {...args} />,
  args: {
    fullWidth: true,
  },
  parameters: {
    docs: {
      source: {
        code: GroupingExampleCode,
        language: 'tsx',
      },
    },
  },
};

export const GroupingSmall: Story = {
  render: (args) => <GroupingExample {...args} />,
  args: {
    fullWidth: true,
    size: 'sm',
    headTextSize: 'md',
  },
  parameters: {
    docs: {
      source: {
        code: GroupingExampleCode,
        language: 'tsx',
      },
    },
  },
};
