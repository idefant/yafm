import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import { Except } from 'type-fest';

import { InputHelperText } from '#ui/InputHelperText';
import { InputLabel } from '#ui/InputLabel';
import { TextAreaBase, TextAreaBaseProps } from '#ui/TextAreaBase';

import { TextAreaClasses } from './textAreaType';

interface TextAreaProps extends Except<TextAreaBaseProps, 'classes'> {
  label?: string;
  error?: string | boolean;
  helper?: string;
  classes?: TextAreaClasses;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helper, classes, ...props }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>();

    const hasErrorText = !!(typeof error === 'string' && error);

    const focusInput = () => localRef.current?.focus();

    return (
      <div className={classes?.container}>
        {label && (
          <InputLabel
            required={props.required}
            onClick={focusInput}
            classes={{ label: classes?.label, text: classes?.labelText }}
          >
            {label}
          </InputLabel>
        )}

        <TextAreaBase
          error={error}
          classes={{
            container: classes?.inputContainer,
            input: classes?.input,
          }}
          ref={mergeRefs([ref, localRef])}
          {...props}
        />

        {hasErrorText && (
          <InputHelperText isError className={classes?.error}>
            {error}
          </InputHelperText>
        )}
        {!hasErrorText && helper && (
          <InputHelperText className={classes?.helper}>{helper}</InputHelperText>
        )}
      </div>
    );
  },
);
