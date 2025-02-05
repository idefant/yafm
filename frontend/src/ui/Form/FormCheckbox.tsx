import { FC } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { Checkbox, CheckboxProps } from '#ui/Checkbox';
import { getProp } from '#utils/getProp';

interface FormCheckboxProps extends CheckboxProps {
  name: string;
}

export const FormCheckbox: FC<FormCheckboxProps> = ({ name, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getProp(errors, name);

  return <Checkbox {...props} {...register(name)} error={!!error} />;
};
