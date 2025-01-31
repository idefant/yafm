import { ReactNode } from 'react';
import { Promisable } from 'type-fest';

import { ButtonColor } from '#ui/Button';

export type ModalIcon = 'warning' | 'error' | 'success';

export type ModalSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type ModalParams<S, T> = {
  title?: string;
  icon?: ModalIcon;
  content?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  cancelColor?: ButtonColor;
  confirmColor?: ButtonColor;
  showCancel?: boolean;
  showConfirm?: boolean;
  preCancel?: () => Promisable<S>;
  preConfirm?: () => Promisable<T>;
  container?: HTMLElement;
  disablePortal?: boolean;
};

export type ModalData<S, T> = ModalParams<S, T> & {
  id: string;
  // hash?: string;
};
