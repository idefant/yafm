import { useCallback, useMemo } from 'react';
import { FieldError, useFormContext, useWatch } from 'react-hook-form';
import { GroupBase } from 'react-select';
import { Except } from 'type-fest';

import { SelectCreatable, SelectCreatableProps } from '#ui/Select';
import { getProp } from '#utils/getProp';

interface FormSelectCreatableProps<
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Except<SelectCreatableProps<Option, IsMulti, Group>, 'name'> {
  nameId: string;
  nameIsCreated: string;
}

export const FormSelectCreatable = <
  Option = unknown,
  IsMulti extends boolean = boolean,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  nameId,
  nameIsCreated,
  options,
  ...props
}: FormSelectCreatableProps<Option, IsMulti, Group>) => {
  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const selectedValue = useWatch({ control, name: nameId });
  const isCreated = useWatch({ control, name: nameIsCreated });

  const error: FieldError | undefined = getProp(errors, nameId);

  const getSelectedOption = useCallback(
    (options?: any): any => {
      if (isCreated) {
        return { input: selectedValue, label: selectedValue };
      }
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
    [isCreated, selectedValue],
  );

  const selectedOption = useMemo(() => getSelectedOption(options), [getSelectedOption, options]);

  return (
    <SelectCreatable
      {...register(nameId)}
      {...props}
      options={options}
      value={selectedOption}
      onChange={(val: any) => {
        setValue(nameIsCreated, false);
        setValue(nameId, val?.value, { shouldValidate: true });
      }}
      onCreateOption={(inputValue) => {
        setValue(nameIsCreated, true);
        setValue(nameId, inputValue, { shouldValidate: true });
      }}
      error={error ? error.message || true : false}
    />
  );
};
