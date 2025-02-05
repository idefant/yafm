import { FC } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { Except } from 'type-fest';

import { Input, InputProps } from '#ui/Input';
import { getProp } from '#utils/getProp';

interface FormInputProps extends Except<InputProps, 'error'> {
  name: string;
}

export const FormInput: FC<FormInputProps> = ({ name, onChange, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getProp(errors, name);

  return (
    <Input
      {...register(name, { onChange })}
      {...props}
      error={
        error &&
        (['required', 'nullable', 'optionality'].includes(error.type) ? true : error.message)
      }
    />
  );
};
