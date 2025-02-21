import { FC, FormHTMLAttributes } from 'react';

import { FormCheckbox } from './FormCheckbox';
import { FormInput } from './FormInput';
import { FormNumber } from './FormNumber';
import { FormPassword } from './FormPassword';
import { FormSelect } from './FormSelect';
import { FormSelectCreatable } from './FormSelectCreatable';
import { FormTextArea } from './FormTextArea';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

interface FormExtensions {
  Input: typeof FormInput;
  Password: typeof FormPassword;
  Checkbox: typeof FormCheckbox;
  Select: typeof FormSelect;
  SelectCreatable: typeof FormSelectCreatable;
  Number: typeof FormNumber;
  Textarea: typeof FormTextArea;
}

export const Form: FC<FormProps> & FormExtensions = (props) => <form {...props} />;

Form.Input = FormInput;
Form.Password = FormPassword;
Form.Checkbox = FormCheckbox;
Form.Select = FormSelect;
Form.SelectCreatable = FormSelectCreatable;
Form.Number = FormNumber;
Form.Textarea = FormTextArea;
