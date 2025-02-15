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
          onValueChange={(v) => onChange(v.value)}
          value={value}
          getInputRef={ref}
          onBlur={onBlur}
          {...props}
          error={error ? error.message || true : false}
        />
      )}
      name={name}
      control={control}
    />
  );
};
