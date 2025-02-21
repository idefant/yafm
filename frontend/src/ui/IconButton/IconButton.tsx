import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { ButtonBase, ButtonBaseProps } from '#ui/ButtonBase';

import cls from './IconButton.module.scss';
import { IconButtonSize } from './iconButtonType';

type IconButtonProps<T extends string | undefined = undefined> =
  ButtonBaseProps<T> extends { children: any }
    ? never
    : ButtonBaseProps<T> & {
        /** Размер кнопки */
        size?: IconButtonSize;
        /** Иконка */
        icon: FunctionComponent<React.SVGProps<SVGSVGElement>>;
      };

export const IconButton = <T extends string | undefined = undefined>({
  size = 'md',
  className,
  icon: Icon,
  ...props
}: IconButtonProps<T>) => (
  <ButtonBase className={classNames(cls.IconButton, cls[size], className)} {...(props as any)}>
    <Icon className={cls.icon} />
  </ButtonBase>
);
