import classNames from 'classnames';
import { FC, FocusEventHandler, ChangeEventHandler } from 'react';

import style from './Select.module.css';

interface SelectProps {
  optGroups?: {
    label: string;
    options: {
      value?: string;
      text: string;
      disabled?: boolean;
    }[];
  }[];
  options?: {
    value?: string;
    text: string;
    disabled?: boolean;
  }[];
  selectedValue?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
  className?: string;
  defaultText?: string;
  useEmpty?: boolean;
  name?: string;
  withError?: boolean;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
}

const Select: FC<SelectProps> = ({
  optGroups,
  options,
  selectedValue,
  onChange,
  className,
  defaultText = 'Choose here',
  useEmpty,
  name,
  withError,
  onBlur,
}) => (
  <select
    value={selectedValue || ''}
    className={classNames(
      'bg-gray-200 rounded-md pl-2 pr-8 py-1.5 focus:outline-none focus:bg-gray-100 border focus:border-gray-600 appearance-none bg-clip-padding bg-no-repeat focus:shadow-none transition-shadow',
      className,
      style.select,
      withError && 'shadow-[0_0_0_3px_#DC2626a0]',
    )}
    onChange={onChange}
    onBlur={onBlur}
    name={name}
  >
    {optGroups?.map((optgroup) => (
      <optgroup label={optgroup.label} key={optgroup.label}>
        {optgroup.options?.map((option) => (
          <option
            value={option.value}
            key={option.value}
            disabled={option.disabled}
          >
            {option.text}
          </option>
        ))}
      </optgroup>
    ))}
    {(!selectedValue || useEmpty) && (
    <option disabled={!useEmpty} hidden={!useEmpty} value="">
      {defaultText}
    </option>
    )}
    {options?.map((option) => (
      <option
        value={option.value}
        key={option.value}
        disabled={option.disabled}
      >
        {option.text}
      </option>
    ))}
  </select>
);

export default Select;
