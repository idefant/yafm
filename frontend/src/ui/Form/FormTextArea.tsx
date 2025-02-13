import { FC } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { TextArea, TextAreaProps } from '#ui/TextArea';
import { getProp } from '#utils/getProp';

interface FormTextAreaProps extends TextAreaProps {
  name: string;
}

export const FormTextArea: FC<FormTextAreaProps> = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getProp(errors, name);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextArea {...props} {...field} error={error ? error.message || true : false} />
      )}
    />
  );
};
