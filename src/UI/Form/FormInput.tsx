import { ComponentProps, FC } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

import { getPropValue } from '../../utils/pathResolver';
import TextInput from '../TextInput';

interface FormInputProps extends Omit<ComponentProps<typeof TextInput>, 'error'> {
  name: string;
}

const FormInput: FC<FormInputProps> = ({ name, onChange, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getPropValue(errors, name);

  return (
    <TextInput
      {...register(name, { onChange })}
      {...props}
      error={
        error &&
        (['required', 'nullable', 'optionality'].includes(error.type) ? true : error.message)
      }
    />
  );
};

export default FormInput;
