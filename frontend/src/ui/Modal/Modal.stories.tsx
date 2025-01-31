import { Meta, StoryObj } from '@storybook/react';

import DialogExample from './examples/Dialog.example';
import DialogExampleCode from './examples/Dialog.example?raw';
import DialogPreActionExample from './examples/DialogPreAction.example';
import DialogPreActionExampleCode from './examples/DialogPreAction.example?raw';
import InternalExample from './examples/Internal.example';
import InternalExampleCode from './examples/Internal.example?raw';
import LongExample from './examples/Long.example';
import LongExampleCode from './examples/Long.example?raw';
import ManyDialogsExample from './examples/ManyDialogs.example';
import ManyDialogsCode from './examples/ManyDialogs.example?raw';
import ModalExample from './examples/Modal.example';
import ModalExampleCode from './examples/Modal.example?raw';
import { Modal } from './Modal';

/** Компонент создан на основе компонента Popup. */

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const WithoutIcon: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    isOpen: import.meta.env.STORYBOOK_SCREENSHOT_MODE,
    title: 'Заголовок модального окна',
    disablePortal: import.meta.env.STORYBOOK_SCREENSHOT_MODE,
  },
  parameters: {
    docs: {
      source: {
        code: ModalExampleCode,
        language: 'tsx',
      },
    },
  },
};

export const Error: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    icon: 'error',
  },
  parameters: WithoutIcon.parameters,
};

export const Success: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    icon: 'success',
  },
  parameters: WithoutIcon.parameters,
};

export const Warning: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    icon: 'warning',
  },
  parameters: WithoutIcon.parameters,
};

export const ExtraExtraSmall: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    size: 'xxs',
  },
  parameters: WithoutIcon.parameters,
};

export const ExtraSmall: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    size: 'xs',
  },
  parameters: WithoutIcon.parameters,
};

export const Small: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    size: 'sm',
  },
  parameters: WithoutIcon.parameters,
};

export const Medium: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    size: 'md',
  },
  parameters: WithoutIcon.parameters,
};

export const Large: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    size: 'lg',
  },
  parameters: WithoutIcon.parameters,
};

export const ExtraLarge: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    size: 'xl',
  },
  parameters: WithoutIcon.parameters,
};

export const ExtraExtraLarge: Story = {
  render: (args) => <ModalExample {...args} />,
  args: {
    ...WithoutIcon.args,
    size: 'xxl',
  },
  parameters: WithoutIcon.parameters,
};

export const Long: Story = {
  render: (args) => <LongExample {...args} />,
  args: {
    isOpen: import.meta.env.STORYBOOK_SCREENSHOT_MODE,
    title:
      'Очень длинный заголовок модального окна с гигантским количеством текста на странице со скроллом',
    disablePortal: import.meta.env.STORYBOOK_SCREENSHOT_MODE,
  },
  parameters: {
    docs: {
      source: {
        code: LongExampleCode,
        language: 'tsx',
      },
    },
  },
};

/**
 * Открытие модального окна с помощью функции.
 */
export const Dialog: Story = {
  render: () => <DialogExample />,
  parameters: {
    docs: {
      source: {
        code: DialogExampleCode,
        language: 'tsx',
      },
    },
  },
};

/**
 * Выполнение асинхронных операций перед закрытием модального окна, открытого с помощью функции.
 */
export const DialogPreAction: Story = {
  render: () => <DialogPreActionExample />,
  parameters: {
    docs: {
      source: {
        code: DialogPreActionExampleCode,
        language: 'tsx',
      },
    },
  },
};

/**
 * При достижении лимита на количество модалок открытых функциональным методом старые модалки закрываются.
 *
 * (Все действия пишутся в консоль)
 */
export const ManyDialogs: Story = {
  render: () => <ManyDialogsExample />,
  parameters: {
    docs: {
      source: {
        code: ManyDialogsCode,
        language: 'tsx',
      },
    },
  },
};

export const InternalModal: Story = {
  render: () => <InternalExample />,
  parameters: {
    docs: {
      source: {
        code: InternalExampleCode,
        language: 'tsx',
      },
    },
  },
};
