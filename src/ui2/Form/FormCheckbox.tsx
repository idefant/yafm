import { ComponentProps, FC } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { getPropValue } from '../../utils/pathResolver';
import Checkbox from '../Checkbox';

interface FormCheckboxProps extends ComponentProps<typeof Checkbox> {
  name: string;
}

const FormCheckbox: FC<FormCheckboxProps> = ({ name, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getPropValue(errors, name);

  return <Checkbox {...props} {...register(name)} error={!!error} />;
};

export default FormCheckbox;
