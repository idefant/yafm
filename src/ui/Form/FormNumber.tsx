import { ComponentProps, FC } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

import { getPropValue } from '../../utils/pathResolver';
import TextInput from '../TextInput';

type FormNumberProps = NumericFormatProps & ComponentProps<typeof TextInput> & { name: string };

const FormNumber: FC<FormNumberProps> = ({ name, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getPropValue(errors, name);

  return (
    <Controller
      render={({ field: { ref, value, onChange, onBlur } }) => (
        <NumericFormat<ComponentProps<typeof TextInput>>
          allowNegative={false}
          allowedDecimalSeparators={[',']}
          thousandSeparator=" "
          customInput={TextInput}
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

export default FormNumber;
