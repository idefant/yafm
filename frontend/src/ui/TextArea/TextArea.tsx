import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { ControlExtraProps, InputControl } from '#ui/InputControl';
import { TextAreaBase, TextAreaBaseProps } from '#ui/TextAreaBase';

import { TextAreaClasses } from './textAreaType';

export interface TextAreaProps extends Except<TextAreaBaseProps, 'classes'>, ControlExtraProps {
  classes?: TextAreaClasses;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, helper, margin, classes, ...props }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>();

    return (
      <InputControl
        label={label}
        inputRef={localRef}
        required={props.required}
        error={props.error}
        helper={helper}
        margin={margin}
        classes={classes}
      >
        <TextAreaBase
          classes={{
            container: classes?.inputContainer,
            input: classes?.input,
          }}
          ref={mergeRefs([ref, localRef])}
          {...props}
        />
      </InputControl>
    );
  },
);
