import classNames from 'classnames';
import { FC, LabelHTMLAttributes } from 'react';
import { Except } from 'type-fest';

import cls from './InputLabel.module.scss';
import { InputLabelClasses } from './inputLabelType';

interface InputLabelProps
  extends Except<LabelHTMLAttributes<HTMLLabelElement>, 'children' | 'className'> {
  required?: boolean;
  classes?: InputLabelClasses;
  children: string;
}

export const InputLabel: FC<InputLabelProps> = ({
  required,
  classes,
  children,
  onClick,
  ...props
}) => (
  <label
    className={classNames(cls.InputLabel, classes?.label, { [cls.required]: required })}
    {...props}
  >
    <span title={children} className={classNames(cls.text, classes?.text)} onClick={onClick}>
      {children}
    </span>
  </label>
);
