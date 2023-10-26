import { ComponentProps, FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Textarea from '../Textarea';

interface FormTextareaProps extends ComponentProps<typeof Textarea> {
  name: string;
}

const FormTextarea: FC<FormTextareaProps> = ({ name, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <Textarea {...props} {...field} />}
    />
  );
};

export default FormTextarea;
