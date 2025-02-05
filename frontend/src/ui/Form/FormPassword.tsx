import { FC } from 'react';
import { FieldError, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';
import { Except } from 'type-fest';

import { InputPassword, InputPasswordProps } from '#ui/InputPassword';
import { getProp } from '#utils/getProp';

interface FormPasswordProps extends Except<InputPasswordProps, 'error'> {
  name: string;
  options?: RegisterOptions<FieldValues, string>;
}

export const FormPassword: FC<FormPasswordProps> = ({ name, options, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getProp(errors, name);

  return (
    <InputPassword
      {...props}
      {...register(name, options)}
      error={error && (error.type === 'required' ? true : error.message)}
    />
  );
};
