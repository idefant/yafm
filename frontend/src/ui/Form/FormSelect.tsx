import { useCallback } from 'react';
import { FieldError, useFormContext, useWatch } from 'react-hook-form';
import { GroupBase } from 'react-select';

import { Select, SelectProps } from '#ui/Select';
import { getProp } from '#utils/getProp';

interface FormSelectProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends SelectProps<Option, IsMulti, Group> {
  name: string;
}

export const FormSelect = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  name,
  options,
  ...props
}: FormSelectProps<Option, IsMulti, Group>) => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext();
  const selectedValue = useWatch({ control, name });

  const error: FieldError | undefined = getProp(errors, name);

  const getSelectedOption = useCallback(
    (options: any): any => {
      if (!options) return null;
      for (const option of options) {
        if (!option.options) {
          if (option.value === selectedValue) return option;
        }
        const foundOption = getSelectedOption(option.options);
        if (foundOption) return foundOption;
      }
      return null;
    },
    [selectedValue],
  );

  const selectedOption = getSelectedOption(options);

  return (
    <Select
      {...register(name)}
      {...props}
      options={options}
      value={selectedOption}
      onChange={(val: any) => {
        setValue(name, val?.value, { shouldValidate: true });
      }}
      error={error ? error.message || true : false}
    />
  );
};
