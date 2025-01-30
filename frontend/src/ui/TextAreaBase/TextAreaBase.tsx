import classNames from 'classnames';
import { ComponentProps, forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import TextAreaAutosize from 'react-textarea-autosize';
import { Except } from 'type-fest';

import cls from './TextAreaBase.module.scss';
import { TextAreaBaseClasses, TextAreaBaseSize } from './textAreaBaseType';

export interface TextAreaBaseProps
  extends Except<ComponentProps<typeof TextAreaAutosize>, 'className'> {
  size?: TextAreaBaseSize;
  error?: string | boolean;
  classes?: TextAreaBaseClasses;
}

export const TextAreaBase = forwardRef<HTMLTextAreaElement, TextAreaBaseProps>(
  ({ size = 'md', error, classes, ...props }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>();

    const hasError = typeof error === 'string' || !!error;

    const focusInput = () => localRef.current?.focus();

    return (
      <div
        className={classNames(cls.TextAreaBase, cls[size], classes?.container, {
          [cls.hasError]: hasError,
        })}
        onClick={focusInput}
      >
        <TextAreaAutosize
          minRows={2}
          className={classNames(cls.input, classes?.input)}
          ref={mergeRefs([ref, localRef])}
          {...props}
        />
      </div>
    );
  },
);
