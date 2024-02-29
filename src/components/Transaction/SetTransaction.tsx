import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';

import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import useModal from '../../hooks/useModal';
import { numberWithDecimalPlacesSchema } from '../../schema';
import { setIsUnsaved } from '../../store/reducers/appSlice';
import { createTransaction, editTransaction } from '../../store/reducers/transactionSlice';
import {
  selectAccountDict,
  selectFilteredAccounts,
  selectCurrencyDict,
} from '../../store/selectors';
import { TTemplate, TTransaction } from '../../types/transactionType';
import Button from '../../ui/Button';
import CalendarButton from '../../ui/CalendarButton';
import DatePicker from '../../ui/DatePicker';
import Form from '../../ui/Form';
import Icon from '../../ui/Icon';
import Modal from '../../ui/Modal';
import { withDigits, withoutDigits } from '../../utils/currencies';
import yup from '../../utils/form/schema';
import { compareObjByStr } from '../../utils/string';
import ChooseTemplate from '../Template/ChooseTemplate';

interface SetTransactionProps {
  transaction?: TTransaction;
  isOpen: boolean;
  close: () => void;
  copiedTransaction?: TTransaction;
}

type TForm = {
  name: string;
  description: string;
  operations: {
    accountId: string | null;
    isPositive: boolean;
    sum: number;
  }[];
  categoryId: string | null;
};

const SetTransaction: FC<SetTransactionProps> = ({
  isOpen,
  close,
  transaction,
  copiedTransaction,
}) => {
  const accounts = useAppSelector(selectFilteredAccounts);
  const accountDict = useAppSelector(selectAccountDict);
  const categories = useAppSelector((state) => state.category.transactions);
  const currencyDict = useAppSelector(selectCurrencyDict);
  const dispatch = useAppDispatch();

  const formSchema = yup.object({
    name: yup.string(),
    description: yup.string(),
    operations: yup
      .array(
        yup.object().shape({
          isPositive: yup.bool().required(),
          accountId: yup.string().required(),
          sum: yup
            .number()
            .positive()
            .required()
            .when('accountId', ([accountId], schema) => {
              const account = accountDict[accountId];
              if (account) {
                const currency = currencyDict[account.currency_code];
                if (currency) {
                  return numberWithDecimalPlacesSchema(currency.decimal_places_number, true);
                }
              }
              return schema;
            }),
        }),
      )
      .min(1),
    categoryId: yup.string(),
  });

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { control, handleSubmit, reset, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'operations',
  });

  const operationsWatcher = useWatch({ control, name: 'operations' });

  const accountOptions = accounts
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((account) => ({ value: account.id, label: account.name }));

  const categoryOptions = [...categories]
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, label: category.name }));

  const [date, setDate] = useState(dayjs());
  const templateModal = useModal();

  const onSubmit = (values: TForm) => {
    const transactionData = {
      datetime: +date,
      name: values.name || undefined,
      description: values.description || undefined,
      category_id: values.categoryId || undefined,
      operations: values.operations.map((operation) => {
        const account = accountDict[operation.accountId as string];
        const currency = currencyDict[account.currency_code];
        return {
          account_id: operation.accountId as string,
          sum:
            withoutDigits(operation.sum, currency.decimal_places_number) *
            (operation.isPositive ? 1 : -1),
        };
      }),
    };

    dispatch(
      transaction
        ? editTransaction({ ...transaction, ...transactionData })
        : createTransaction(transactionData),
    );
    dispatch(setIsUnsaved(true));
    close();
  };

  const getTemplateData = (template: TTemplate) => {
    const operations = template.operations
      .slice()
      .sort((a, b) => b.sum - a.sum)
      .map((operation) => {
        const account = accountDict[operation.account_id];
        const currency = currencyDict[account.currency_code];
        return {
          accountId: operation.account_id,
          sum: withDigits(Math.abs(operation.sum), currency.decimal_places_number),
          isPositive: operation.sum > 0,
        };
      });

    return {
      name: template.name || '',
      description: template.description || '',
      categoryId: template.category_id || '',
      operations,
    };
  };

  const trans = transaction || copiedTransaction;

  const initialOperations = trans?.operations
    .slice()
    .sort((a, b) => b.sum - a.sum)
    .map((operation) => {
      const account = accountDict[operation.account_id];
      const currency = currencyDict[account.currency_code];
      return {
        accountId: operation.account_id,
        sum: withDigits(Math.abs(operation.sum), currency.decimal_places_number),
        isPositive: operation.sum > 0,
      };
    });

  const defaultOperations = [{ accountId: '', sum: undefined, isPositive: false }];

  const onEntering = () => {
    reset({
      name: trans?.name || '',
      description: trans?.description || '',
      operations: initialOperations || defaultOperations,
      categoryId: trans?.category_id || '',
    });
    setDate(dayjs(transaction?.datetime));
  };

  const onExited = () => reset();

  return (
    <Modal isOpen={isOpen} close={close} onEntering={onEntering} onExited={onExited} width="big">
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header close={close}>
            {transaction ? 'Edit Transaction' : 'Create Transaction'}
            {!transaction && !copiedTransaction && (
              <Button
                color="yellow"
                className="text-sm !px-2 !py-1 ml-4"
                onClick={templateModal.open}
              >
                Use Template
              </Button>
            )}
          </Modal.Header>
          <Modal.Content>
            <Form.Input label="Name" name="name" />

            <div className="flex items-center my-2 gap-3">
              <label className="block w-1/3" htmlFor="categoryId">
                Category
              </label>
              <Form.Select
                className="w-2/3"
                placeholder="Choose a category"
                options={categoryOptions}
                isClearable
                name="categoryId"
              />
            </div>

            {fields.map((operation, i) => {
              const operationWatcher = operationsWatcher[i];
              const account = operationWatcher?.accountId
                ? accountDict[operationWatcher.accountId]
                : undefined;
              const currency = account ? currencyDict[account.currency_code] : undefined;

              return (
                <div className="flex items-center my-2 gap-3" key={operation.id}>
                  <Button
                    color={operationWatcher?.isPositive ? 'green' : 'red'}
                    className="!p-1"
                    onClick={() =>
                      setValue(`operations.${i}.isPositive`, !operationWatcher?.isPositive)
                    }
                  >
                    {operationWatcher?.isPositive ? <Icon.Plus /> : <Icon.Minus />}
                  </Button>

                  <Form.Select
                    className="w-1/2"
                    placeholder="Account"
                    options={accountOptions}
                    name={`operations.${i}.accountId`}
                  />
                  <div className="w-1/2 flex gap-4 items-center">
                    <Form.Number
                      name={`operations.${i}.sum`}
                      decimalScale={currency?.decimal_places_number}
                    />
                    {currency && <div>{currency.code}</div>}
                  </div>

                  <Button
                    color="red"
                    className="!p-1"
                    onClick={() => remove(i)}
                    disabled={fields.length === 1}
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
                onClick={() => append({ accountId: null, sum: undefined as any, isPositive: true })}
              >
                Income
              </Button>

              <Button
                color="red"
                className="!py-1"
                onClick={() =>
                  append({ accountId: null, sum: undefined as any, isPositive: false })
                }
              >
                Outcome
              </Button>
            </div>

            <Form.Textarea name="description" placeholder="Description ..." />

            <div className="flex gap-2 mt-2 items-center">
              <DatePicker date={date} setDate={setDate} />
              <CalendarButton date={date} setDate={setDate} />
            </div>
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
      </FormProvider>

      <ChooseTemplate
        isOpen={templateModal.isOpen}
        close={templateModal.close}
        setTransaction={(template) => reset(getTemplateData(template))}
      />
    </Modal>
  );
};

export default SetTransaction;
