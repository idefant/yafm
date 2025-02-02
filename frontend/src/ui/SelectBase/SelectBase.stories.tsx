import { Meta, StoryObj } from '@storybook/react';

import { SelectBase } from './SelectBase';

const meta = {
  title: 'UI/SelectBase',
  component: SelectBase,
  args: {
    size: 'md',
    placeholder: 'Placeholder',
    options: [
      { label: 'First', value: 'first' },
      { label: 'Second', value: 'second' },
      { label: 'Third', value: 'third' },
      { label: 'Last', value: 'last' },
    ],
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 250,
      },
    },
  },
} satisfies Meta<typeof SelectBase>;

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
    isDisabled: true,
  },
};

export const WithError: Story = {
  args: {
    error: true,
  },
};

export const MultiLarge: Story = {
  args: {
    isMulti: true,
    size: 'lg',
    defaultValue: [
      { label: 'First', value: 'first' },
      { label: 'Last', value: 'last' },
    ],
  },
};

export const MultiMedium: Story = {
  args: {
    isMulti: true,
    size: 'md',
    defaultValue: [
      { label: 'First', value: 'first' },
      { label: 'Last', value: 'last' },
    ],
  },
};

export const MultiSmall: Story = {
  args: {
    isMulti: true,
    size: 'sm',
    defaultValue: [
      { label: 'First', value: 'first' },
      { label: 'Last', value: 'last' },
    ],
  },
};

export const Clearable: Story = {
  args: {
    isClearable: true,
  },
};

export const WithGroups: Story = {
  args: {
    options: [
      {
        label: 'Frontend',
        options: [
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
          { label: 'Angular', value: 'angular' },
        ],
      },
      {
        label: 'Backend',
        options: [
          { label: 'Express.js', value: 'express' },
          { label: 'Gin', value: 'gin' },
          { label: 'FastAPI', value: 'fastapi' },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      story: {
        iframeHeight: 400,
      },
    },
  },
};
