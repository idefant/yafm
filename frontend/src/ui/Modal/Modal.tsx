import classNames from 'classnames';
import { FC } from 'react';

import AlertTriangleIcon from '#svg/alert-triangle.svg?react';
import CheckCircleIcon from '#svg/check-circle.svg?react';
import XCircleIcon from '#svg/x-circle.svg?react';
import XIcon from '#svg/x.svg?react';
import { Popup, PopupProps } from '#ui/Popup';
import { Title } from '#ui/Typography';

import cls from './Modal.module.scss';
import { ModalContent } from './ModalContent';
import { ModalFooter } from './ModalFooter';
import { ModalIcon, ModalSize } from './modalType';

interface ModalProps extends PopupProps {
  /** Заголовок */
  title?: string;
  /** Иконка */
  icon?: ModalIcon;
  /** Размеры модального окна */
  size?: ModalSize;
}

interface ModalExtensions {
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
}

const iconsDict = {
  warning: <AlertTriangleIcon className={classNames(cls.icon, cls.iconWarning)} />,
  error: <XCircleIcon className={classNames(cls.icon, cls.iconError)} />,
  success: <CheckCircleIcon className={classNames(cls.icon, cls.iconSuccess)} />,
};

export const Modal: FC<ModalProps> & ModalExtensions = ({
  children,
  title,
  close,
  icon,
  size = 'xs',
  ...props
}: ModalProps) => (
  <Popup classes={{ window: cls.popup }} close={close} {...props}>
    <div className={classNames(cls.Modal, cls[size])}>
      <div className={cls.body}>
        {icon && iconsDict[icon]}

        <div className={cls.content}>
          {close && (
            <button type="button" className={cls.xButton} onClick={close} aria-label="Close">
              <XIcon />
            </button>
          )}
          {title && (
            <Title level={4} gutterBottom>
              {title}
            </Title>
          )}

          {children}
        </div>
      </div>
    </div>
  </Popup>
);

Modal.Content = ModalContent;
Modal.Footer = ModalFooter;
