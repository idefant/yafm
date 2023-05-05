import { FieldArray, Form, Formik } from 'formik';
import { FC } from 'react';
import { array, bool, object, string } from 'yup';
import 'react-datepicker/dist/react-datepicker.css';

import { parseInputPrice, formatPrice } from '../../helper/currencies';
import { compareObjByStr } from '../../helper/string';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { numberWithDecimalPlacesSchema } from '../../schema';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { createTemplate, editTemplate } from '../../store/reducers/transactionSlice';
import {
  selectFilteredAccounts,
  selectAccountDict,
  selectFilteredTransactionCategories,
  selectCurrencyDict,
} from '../../store/selectors';
import { TTemplate } from '../../types/transactionType';
import Button from '../Generic/Button/Button';
import FormField, { FormFieldInput } from '../Generic/Form/FormField';
import Select from '../Generic/Form/Select';
import Textarea from '../Generic/Form/Textarea';
import Icon from '../Generic/Icon';
import Modal from '../Generic/Modal';

interface SetTemplateProps {
  template?: TTemplate;
  isOpen: boolean;
  close: () => void;
}

const SetTemplate: FC<SetTemplateProps> = ({ isOpen, close, template }) => {
  const currencyDict = useAppSelector(selectCurrencyDict);
  const accounts = useAppSelector(selectFilteredAccounts);
  const accountDict = useAppSelector(selectAccountDict);
  const categories = useAppSelector(selectFilteredTransactionCategories);

  const dispatch = useAppDispatch();

  const accountOptions = accounts
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((account) => ({ value: account.id, label: account.name }));

  const categoryOptions = categories
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, label: category.name }));

  type TForm = {
    name: string;
    description: string;
    operations: { accountId: string; isPositive: boolean; sum: string }[];
    categoryId: string;
  };

  const onSubmit = (values: TForm) => {
    const templateData = {
      name: values.name || undefined,
      description: values.description || undefined,
      category_id: values.categoryId || undefined,
      operations: values.operations.map((operation) => {
        const account = accountDict[operation.accountId];
        const currency = currencyDict[account.currency_code];
        const sum = parseInputPrice(operation.sum, currency.decimal_places_number);
        return {
          account_id: operation.accountId,
          sum: sum * (operation.isPositive ? 1 : -1),
        };
      }),
    };

    dispatch(
      template ? editTemplate({ ...template, ...templateData }) : createTemplate(templateData),
    );
    dispatch(setIsUnsaved(true));
    close();
  };

  const initialOperations = template?.operations
    .slice()
    .sort((a, b) => b.sum - a.sum)
    .map((operation) => {
      const account = accountDict[operation.account_id];
      const currency = currencyDict[account.currency_code];
      return {
        accountId: operation.account_id,
        sum: formatPrice(Math.abs(operation.sum), currency.decimal_places_number, {
          useGrouping: false,
        }),
        isPositive: operation.sum > 0,
      };
    });

  const defaultOperations = [{ accountId: '', sum: '', isPositive: false }];

  const initialValues: TForm = {
    name: template?.name || '',
    description: template?.description || '',
    operations: initialOperations || defaultOperations,
    categoryId: template?.category_id || '',
  };

  return (
    <Modal isOpen={isOpen} close={close} width="big">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={object({
          name: string(),
          description: string(),
          operations: array(
            object().shape({
              isPositive: bool().required(),
              accountId: string().required(),
              sum: string()
                .required()
                .when('accountId', (data, schema) => {
                  const account = accountDict[data];
                  if (account) {
                    const currency = currencyDict[account.currency_code];
                    if (currency) {
                      return numberWithDecimalPlacesSchema(currency.decimal_places_number, true);
                    }
                  }
                  return schema;
                }),
            }),
          ).min(1),
          categoryId: string(),
        })}
        validateOnChange={false}
        validateOnBlur
      >
        {({ errors, values, handleChange, validateField, setFieldValue }) => (
          <Form>
            <Modal.Header close={close}>
              {template ? 'Edit Template' : 'Create Template'}
            </Modal.Header>
            <Modal.Content>
              <FormField label="Name" name="name" value={values.name} onChange={handleChange} />

              <div className="flex items-center my-2 gap-3">
                <label className="block w-1/3" htmlFor="categoryId">
                  Category
                </label>
                <Select
                  className="w-2/3"
                  placeholder="Choose a category"
                  options={categoryOptions}
                  isClearable
                  name="categoryId"
                  value={categoryOptions.find((option) => option.value === values.categoryId)}
                  onChange={(newValue: any) => setFieldValue('categoryId', newValue?.value)}
                />
              </div>

              <FieldArray name="operations">
                {({ remove, push }) => (
                  <>
                    {values.operations.map((operation, index) => {
                      const account = accountDict[operation.accountId];
                      const currency = account ? currencyDict[account.currency_code] : undefined;

                      return (
                        <div className="flex items-center my-2 gap-3" key={index}>
                          <Button
                            color={operation.isPositive ? 'green' : 'red'}
                            className="!p-1"
                            onClick={() =>
                              setFieldValue(`operations.${index}.isPositive`, !operation.isPositive)
                            }
                          >
                            {operation.isPositive ? <Icon.Plus /> : <Icon.Minus />}
                          </Button>

                          <Select
                            className="w-1/2"
                            placeholder="Account"
                            options={accountOptions}
                            name="accountId"
                            value={accountOptions.find(
                              (option) => option.value === values.operations[index].accountId,
                            )}
                            onBlur={() => validateField(`operations.${index}.accountId`)}
                            onChange={(newValue: any) =>
                              setFieldValue(`operations.${index}.accountId`, newValue?.value)
                            }
                            withError={(() => {
                              const error = errors.operations?.[index];
                              if (!error || typeof error === 'string') return false;
                              return Boolean(error.accountId);
                            })()}
                          />
                          <div className="w-1/2 flex gap-4 items-center">
                            <FormFieldInput
                              name="incomeSum"
                              value={values.operations[index].sum}
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/,/g, '.')
                                  .replace(/[^0-9. ]/g, '');
                                if (value.split('.').length - 1 <= 1) {
                                  setFieldValue(`operations.${index}.sum`, value);
                                }
                              }}
                              onBlur={() => validateField(`operations.${index}.sum`)}
                              withError={(() => {
                                const error = errors.operations?.[index];
                                if (!error || typeof error === 'string') return false;
                                return Boolean(error.sum);
                              })()}
                            />
                            {currency && <div>{currency.code}</div>}
                          </div>

                          <Button
                            color="red"
                            className="!p-1"
                            onClick={() => remove(index)}
                            disabled={values.operations.length === 1}
                          >
                            <Icon.Trash />
                          </Button>
                        </div>
                      );
                    })}

                    <div className="flex my-3 gap-4 justify-center">
                      <Button
                        color="green"
                        className="!py-1"
                        onClick={() => push({ accountId: undefined, sum: '', isPositive: true })}
                      >
                        Income
                      </Button>

                      <Button
                        color="red"
                        className="!py-1"
                        onClick={() => push({ accountId: undefined, sum: '', isPositive: false })}
                      >
                        Outcome
                      </Button>
                    </div>
                  </>
                )}
              </FieldArray>

              <Textarea
                value={values.description}
                name="description"
                onChange={handleChange}
                placeholder="Description ..."
              />
            </Modal.Content>
            <Modal.Footer>
              <Button color="green" type="submit">
                Save
              </Button>
              <Button color="gray" onClick={close}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default SetTemplate;
