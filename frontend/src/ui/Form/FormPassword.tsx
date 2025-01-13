import { ComponentProps, FC } from 'react';
import { FieldError, FieldValues, RegisterOptions, useFormContext } from 'react-hook-form';

import PasswordInput from '#ui/PasswordInput';
import { getProp } from '#utils/getProp';

interface FormPasswordProps extends Omit<ComponentProps<typeof PasswordInput>, 'error'> {
  name: string;
  options?: RegisterOptions<FieldValues, string>;
}

const FormPassword: FC<FormPasswordProps> = ({ name, options, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getProp(errors, name);

  return (
    <PasswordInput
      {...props}
      {...register(name, options)}
      error={error && (error.type === 'required' ? true : error.message)}
    />
  );
};

export default FormPassword;
