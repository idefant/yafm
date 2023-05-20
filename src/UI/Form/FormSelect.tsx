import { ComponentProps, FC } from 'react';
import { Controller, FieldError, useFormContext } from 'react-hook-form';

import { getPropValue } from '../../utils/pathResolver';
import Select from '../Select';

interface FormSelectProps extends ComponentProps<typeof Select> {
  name: string;
}

const FormSelect: FC<FormSelectProps> = ({ name, options, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getPropValue(errors, name)?.value;

  const optionFinder = (options: any, value: string): any => {
    if (!options) return null;
    for (const c of options) {
      if (!c.options) {
        if (c.value === value) return c;
      }
      const foundOption = optionFinder(c.options, value);
      if (foundOption) return foundOption;
    }
    return null;
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          {...props}
          options={options}
          value={optionFinder(options, field.value)}
          onChange={(val: any) => field.onChange(val?.value)}
          ref={field.ref}
          error={
            error &&
            (['required', 'nullable', 'optionality'].includes(error.type) ? true : error.message)
          }
        />
      )}
    />
  );
};

export default FormSelect;
