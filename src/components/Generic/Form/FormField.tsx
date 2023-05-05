import classNames from 'classnames';
import { ChangeEvent, FC, FocusEventHandler, HTMLInputTypeAttribute } from 'react';

interface FormFieldProps {
  label: string;
  value?: string | number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  units?: string;
  type?: HTMLInputTypeAttribute;
  name?: string;
  withError?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

const FormField: FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  units,
  type = 'text',
  name,
  withError,
  onBlur,
}) => (
  <div className="flex items-center my-3 gap-3">
    <label className="block w-1/3">{label}</label>
    <div className="w-2/3 flex gap-4 items-center">
      <FormFieldInput
        value={value}
        onChange={onChange}
        name={name}
        onBlur={onBlur}
        type={type}
        withError={withError}
      />
      {units && <div>{units}</div>}
    </div>
  </div>
);

interface FormFieldInputProps {
  value?: string | number;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  name?: string;
  withError?: boolean;
  onBlur?: FocusEventHandler<HTMLInputElement>;
}

export const FormFieldInput: FC<FormFieldInputProps> = ({
  value,
  onChange,
  type = 'text',
  name,
  withError,
  onBlur,
}) => (
  <input
    type={type}
    className={classNames(
      'w-full flex-1 bg-slate-700 rounded-md px-3 py-1.5 focus:outline-none border border-slate-100/30 focus:border-slate-100/60 focus:shadow focus:shadow-slate-100/50 text-slate-200 transition-shadow',
      withError && 'shadow-[0_0_0_3px_#ff0000c5]',
    )}
    value={value}
    onChange={onChange}
    name={name}
    onBlur={onBlur}
  />
);

export default FormField;
