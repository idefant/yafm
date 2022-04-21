import { useState } from "react";

type TFields = {
  [key: string]: string;
};

type ChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

const useForm = (
  initialFields: TFields
): [TFields, (e: ChangeEvent) => void, (fields: TFields) => void] => {
  const [fields, setField] = useState(initialFields);

  const setValue = (e: ChangeEvent) => {
    if (e.target.name in fields) {
      setField({ ...fields, [e.target.name]: e.target.value });
    }
  };

  const updateValue = (updatedFields: TFields) =>
    setField({ ...fields, ...updatedFields });

  return [fields, setValue, updateValue];
};

export default useForm;
