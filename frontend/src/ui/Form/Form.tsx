import { FC, FormHTMLAttributes } from 'react';

import { FormCheckbox } from './FormCheckbox';
import { FormInput } from './FormInput';
import { FormNumber } from './FormNumber';
import { FormPassword } from './FormPassword';
import { FormSelect } from './FormSelect';
import { FormTextArea } from './FormTextArea';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

interface FormExtensions {
  Input: typeof FormInput;
  Password: typeof FormPassword;
  Checkbox: typeof FormCheckbox;
  Select: typeof FormSelect;
  Number: typeof FormNumber;
  Textarea: typeof FormTextArea;
}

export const Form: FC<FormProps> & FormExtensions = (props) => <form {...props} />;

Form.Input = FormInput;
Form.Password = FormPassword;
Form.Checkbox = FormCheckbox;
Form.Select = FormSelect;
Form.Number = FormNumber;
Form.Textarea = FormTextArea;
