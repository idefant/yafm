import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { TextArea, TextAreaProps } from '#ui/TextArea';

interface FormTextAreaProps extends TextAreaProps {
  name: string;
}

export const FormTextArea: FC<FormTextAreaProps> = ({ name, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <TextArea {...props} {...field} />}
    />
  );
};
