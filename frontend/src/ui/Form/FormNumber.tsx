import { FC } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { InputNumber, InputNumberProps } from '#ui/InputNumber';
import { getProp } from '#utils/getProp';

type FormNumberProps = InputNumberProps & { name: string };

export const FormNumber: FC<FormNumberProps> = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getProp(errors, name);

  return (
    <Controller
      render={({ field: { ref, value, onChange, onBlur } }) => (
        <InputNumber
          onValueChange={(v) => onChange(v.floatValue || null)}
          value={value}
          getInputRef={ref}
          onBlur={onBlur}
          {...props}
          error={
            error &&
            (['required', 'nullable', 'optionality'].includes(error.type) ? true : error.message)
          }
        />
      )}
      name={name}
      control={control}
    />
  );
};
