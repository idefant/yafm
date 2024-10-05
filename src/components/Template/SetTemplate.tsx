import { yupResolver } from '@hookform/resolvers/yup';
import BigNumber from 'bignumber.js';
import { FC } from 'react';
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';

import { useAppSelector, useAppDispatch } from '#hooks/reduxHooks';
import { numberWithDecimalPlacesSchema } from '#schema';
import { store } from '#store';
import {
  transactionTemplateAdded,
  transactionTemplateUpdated,
} from '#store/reducers/transactionTemplatesSlice';
import {
  selectAllAccountsCombined,
  selectAllAccountsCombinedEntities,
  selectAllTransactionCategories,
  selectTransactionTemplateById,
} from '#store/selectors';
import { TransactionTemplate } from '#types/transactionType';
import Button from '#ui/Button';
import Form from '#ui/Form';
import Icon from '#ui/Icon';
import Modal from '#ui/Modal';
import { committer } from '#utils/committer';
import yup from '#utils/form/schema';
import { getChanges } from '#utils/getChanges';
import { genId } from '#utils/random';
import { compareObjByStr } from '#utils/string';

interface SetTemplateProps {
  template?: TransactionTemplate;
  isOpen: boolean;
  close: () => void;
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

const commitDataKeys: (keyof TransactionTemplate)[] = [
  'name',
  'category_id',
  'operations',
  'description',
];

const SetTemplate: FC<SetTemplateProps> = ({ isOpen, close, template }) => {
  const accounts = useAppSelector(selectAllAccountsCombined);
  const accountsEntities = useAppSelector(selectAllAccountsCombinedEntities);
  const categories = useAppSelector(selectAllTransactionCategories);
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
              const account = accountsEntities[accountId];
              if (!account) return schema;
              return numberWithDecimalPlacesSchema(account.currency.decimal_places_number, true);
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
    .map((account) => ({ value: account.id, label: account.name, is_archive: account.is_archive }));

  const categoryOptions = categories
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, label: category.name }));

  const onSubmit = async (values: TForm) => {
    const templateData = {
      name: values.name || undefined,
      description: values.description || undefined,
      category_id: values.categoryId || undefined,
      operations: values.operations.map((operation) => ({
        account_id: operation.accountId as string,
        sum: (operation.sum * (operation.isPositive ? 1 : -1)).toString(),
      })),
    };

    if (template) {
      const oldValue = selectTransactionTemplateById(store.getState(), template.id);
      const changes = getChanges(oldValue, templateData, commitDataKeys);

      dispatch(transactionTemplateUpdated({ id: template.id, changes }));
      committer({
        method: 'update_transaction_template',
        data: { id: template.id, ...changes },
      }).sync();
    } else {
      const newTemplate = { id: genId(), ...templateData };
      dispatch(transactionTemplateAdded(newTemplate));
      committer({ method: 'create_transaction_template', data: newTemplate }).sync();
    }
    close();
  };

  const initialOperations = template?.operations
    .slice()
    .sort((a, b) => BigNumber(b.sum).minus(a.sum).toNumber())
    .map((operation) => ({
      accountId: operation.account_id,
      sum: BigNumber(operation.sum).abs().toNumber(),
      isPositive: BigNumber(operation.sum).isPositive(),
    }));

  const defaultOperations = [{ accountId: '', sum: undefined, isPositive: false }];

  const onEntering = () => {
    reset({
      name: template?.name || '',
      description: template?.description || '',
      operations: initialOperations || defaultOperations,
      categoryId: template?.category_id || '',
    });
  };

  const onExited = () => reset();

  return (
    <Modal isOpen={isOpen} close={close} onEntering={onEntering} onExited={onExited} width="big">
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header close={close}>
            {template ? 'Edit Template' : 'Create Template'}
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
                ? accountsEntities[operationWatcher.accountId]
                : undefined;
              const currency = account?.currency;

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
                    filterOption={(option, inputValue) => {
                      if ((option.data as any).is_archive) return false;
                      return option.label.toLowerCase().includes(inputValue.toLowerCase());
                    }}
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
    </Modal>
  );
};

export default SetTemplate;
