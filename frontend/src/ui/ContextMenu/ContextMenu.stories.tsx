import { Meta, StoryObj } from '@storybook/react';

import CopyIcon from '#svg/copy.svg?react';
import PencilIcon from '#svg/pencil.svg?react';
import TrashIcon from '#svg/trash.svg?react';

import { ContextMenu } from './ContextMenu';

const meta = {
  title: 'UI/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { key: 'update', label: 'Edit', onClick: () => alert('You have clicked "Edit"') },
      { key: 'copy', label: 'Copy', onClick: () => alert('You have clicked "Copy"') },
      { key: 'delete', label: 'Delete', onClick: () => alert('You have clicked "Delete"') },
    ],
    getElement: () => document.getElementById('contextMenuArea_default'),
  },
  render: (props) => (
    <div style={{ background: 'gray', padding: '60px 40px' }} id="contextMenuArea_default">
      Right-click
      <ContextMenu {...props} />
    </div>
  ),
};

export const WithIcons: Story = {
  args: {
    items: [
      {
        key: 'update',
        label: 'Edit',
        icon: PencilIcon,
        onClick: () => alert('You have clicked "Edit"'),
      },
      {
        key: 'copy',
        label: 'Copy',
        icon: CopyIcon,
        onClick: () => alert('You have clicked "Copy"'),
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: TrashIcon,
        onClick: () => alert('You have clicked "Delete"'),
      },
    ],
    getElement: () => document.getElementById('contextMenuArea_withIcons'),
  },
  render: (props) => (
    <div style={{ background: 'gray', padding: '60px 40px' }} id="contextMenuArea_withIcons">
      Right-click
      <ContextMenu {...props} />
    </div>
  ),
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
    items: [
      { key: 'update', label: 'Edit', onClick: () => alert('You have clicked "Edit"') },
      { key: 'copy', label: 'Copy', onClick: () => alert('You have clicked "Copy"') },
      { key: 'delete', label: 'Delete', onClick: () => alert('You have clicked "Delete"') },
    ],
    getElement: () => document.getElementById('contextMenuArea_withLabel'),
  },
  render: (props) => (
    <div style={{ background: 'gray', padding: '60px 40px' }} id="contextMenuArea_withLabel">
      Right-click
      <ContextMenu {...props} />
    </div>
  ),
};
