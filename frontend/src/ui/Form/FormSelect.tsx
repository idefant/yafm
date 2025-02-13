import { Controller, FieldError, useFormContext } from 'react-hook-form';
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
    formState: { errors },
  } = useFormContext();

  const error: FieldError | undefined = getProp(errors, name);

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
          error={error ? error.message || true : false}
        />
      )}
    />
  );
};
