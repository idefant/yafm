import classNames from 'classnames';
import { FC, HTMLAttributes } from 'react';

import style from './Alert.module.scss';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant: 'success' | 'error';
}

export const Alert: FC<AlertProps> = ({ variant, ...props }) => (
  <div className={classNames(style.Alert, style[variant])} {...props} />
);
