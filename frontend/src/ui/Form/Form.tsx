import { FC, FormHTMLAttributes } from 'react';

import { FormCheckbox } from './FormCheckbox';
import { FormInput } from './FormInput';
import { FormNumber } from './FormNumber';
import { FormPassword } from './FormPassword';
import { FormSelect } from './FormSelect';
import { FormTextArea } from './FormTextArea2';

interface FormExtensions {
  Input: typeof FormInput;
  Password: typeof FormPassword;
  Checkbox: typeof FormCheckbox;
  Select: typeof FormSelect;
  Number: typeof FormNumber;
  Textarea: typeof FormTextArea;
}

const Form: FC<FormHTMLAttributes<HTMLFormElement>> & FormExtensions = (props) => (
  <form {...props} />
);

Form.Input = FormInput;
Form.Password = FormPassword;
Form.Checkbox = FormCheckbox;
Form.Select = FormSelect;
Form.Number = FormNumber;
Form.Textarea = FormTextArea;

export default Form;
