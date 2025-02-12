import { yupResolver } from '@hookform/resolvers/yup';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { FC, useId, useState } from 'react';
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';

import { ChooseTemplate } from '#components/Template';
import { useAppSelector } from '#hooks/reduxHooks';
import { numberWithDecimalPlacesSchema } from '#schema';
import {
  selectAllAccountsCombined,
  selectAllAccountsCombinedEntities,
  selectAllTransactionCategories,
} from '#store/selectors';
import MinusIcon from '#svg/minus.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { Transaction, TransactionTemplate } from '#types/transactionType';
import { Button } from '#ui/Button';
import CalendarButton from '#ui/CalendarButton';
import { Form } from '#ui/Form';
import { Grid } from '#ui/Grid';
import { IconButton } from '#ui/IconButton';
import { Modal, useModal, UseModalReturn } from '#ui/Modal';
import { HStack, VStack } from '#ui/Stack';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import yup from '#utils/form/schema';
import { compareObjByStr } from '#utils/string';

export type SetTransactionModalData =
  | { method: 'create'; transaction?: undefined }
  | { method: 'edit' | 'copy'; transaction: Transaction };

interface SetTransactionProps {
  modal: UseModalReturn<SetTransactionModalData>;
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

export const SetTransaction: FC<SetTransactionProps> = ({ modal }) => {
  const formId = useId();

  const accounts = useAppSelector(selectAllAccountsCombined);
  const accountsEntities = useAppSelector(selectAllAccountsCombinedEntities);
  const categories = useAppSelector(selectAllTransactionCategories);

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

  const categoryOptions = [...categories]
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, label: category.name }));

  const [date, setDate] = useState(dayjs());
  const templateModal = useModal();

  const onSubmit = async (values: TForm) => {
    if (!modal.isOpen) return;

    const transactionData = {
      datetime: +date,
      name: values.name || undefined,
      description: values.description || undefined,
      category_id: values.categoryId || undefined,
      operations: values.operations.map((operation) => ({
        account_id: operation.accountId as string,
        sum: (operation.sum * (operation.isPositive ? 1 : -1)).toString(),
      })),
    };

    committer(
      modal.data.method === 'create'
        ? actionCreator.createTransaction(transactionData)
        : actionCreator.updateTransaction(modal.data.transaction.id, transactionData),
    ).sync();
    modal.close();
  };

  const getTemplateData = (template: TransactionTemplate) => {
    const operations = template.operations
      .slice()
      .sort((a, b) => BigNumber(b.sum).minus(a.sum).toNumber())
      .map((operation) => ({
        accountId: operation.account_id,
        sum: BigNumber(operation.sum).abs().toNumber(),
        isPositive: BigNumber(operation.sum).isPositive(),
      }));

    return {
      name: template.name || '',
      description: template.description || '',
      categoryId: template.category_id || '',
      operations,
    };
  };

  const initialOperations = modal.data?.transaction?.operations
    .slice()
    .sort((a, b) => BigNumber(b.sum).minus(a.sum).toNumber())
    .map((operation) => ({
      accountId: operation.account_id,
      sum: BigNumber(operation.sum).abs().toNumber(),
      isPositive: BigNumber(operation.sum).isPositive(),
    }));

  const defaultOperations = [{ accountId: '', sum: undefined, isPositive: false }];

  const onOpening = () => {
    if (!modal.isOpen) return;
    reset({
      name: modal.data.transaction?.name || '',
      description: modal.data.transaction?.description || '',
      operations: initialOperations || defaultOperations,
      categoryId: modal.data.transaction?.category_id || '',
    });
    setDate(dayjs(modal.data.method === 'edit' ? modal.data.transaction.datetime : undefined));
  };

  const onExited = () => reset();

  return (
    <Modal isOpen={modal.isOpen} close={modal.close} onOpening={onOpening} onExited={onExited}>
      <Modal.Content>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <HStack align="center" gap={16}>
              <Title level={4}>
                {modal.data?.method === 'create' ? 'Create Transaction' : 'Edit Transaction'}
              </Title>
              {modal.data?.method === 'create' && (
                <Button size="sm" onClick={templateModal.open}>
                  Use Template
                </Button>
              )}
            </HStack>

            <Form.Input label="Name" name="name" />

            <Form.Select
              label="Category"
              placeholder="Choose category..."
              options={categoryOptions}
              isClearable
              name="categoryId"
            />

            <VStack gap={24}>
              {fields.map((operation, i) => {
                const operationWatcher = operationsWatcher[i];
                const account = operationWatcher?.accountId
                  ? accountsEntities[operationWatcher.accountId]
                  : undefined;
                const currency = account?.currency;
                const isPositive = operationWatcher?.isPositive;

                return (
                  <HStack key={operation.id}>
                    <IconButton
                      icon={isPositive ? PlusIcon : MinusIcon}
                      color={isPositive ? 'success' : 'danger'}
                      onClick={() => setValue(`operations.${i}.isPositive`, !isPositive)}
                      style={{ marginTop: i === 0 ? 22 : -2 }}
                      key={isPositive ? 'plus' : 'minus'}
                    />

                    <Grid gap={8} style={{ flex: 1 }}>
                      <Grid.Item size={6}>
                        <Form.Select
                          label={i === 0 ? 'Account' : undefined}
                          placeholder="Choose account..."
                          options={accountOptions}
                          name={`operations.${i}.accountId`}
                          margin="none"
                          filterOption={(option, inputValue) => {
                            if ((option.data as any).is_archive) return false;
                            return option.label.toLowerCase().includes(inputValue.toLowerCase());
                          }}
                        />
                      </Grid.Item>
                      <Grid.Item size={6}>
                        <Form.Number
                          label={i === 0 ? 'Amount' : undefined}
                          name={`operations.${i}.sum`}
                          decimalScale={currency?.decimal_places_number}
                          allowNegative={false}
                          suffix={currency?.code}
                          margin="none"
                        />
                      </Grid.Item>
                    </Grid>

                    <IconButton
                      icon={TrashIcon}
                      color="danger"
                      onClick={() => remove(i)}
                      disabled={fields.length === 1}
                      style={{ marginTop: i === 0 ? 22 : -2 }}
                      key={fields.length === 1 ? 'disabled' : 'enabled'}
                    />
                  </HStack>
                );
              })}

              <HStack justify="center">
                <Button
                  color="success"
                  startIcon={<PlusIcon />}
                  onClick={() =>
                    append({ accountId: null, sum: undefined as any, isPositive: true })
                  }
                >
                  Income
                </Button>

                <Button
                  color="danger"
                  startIcon={<MinusIcon />}
                  onClick={() =>
                    append({ accountId: null, sum: undefined as any, isPositive: false })
                  }
                >
                  Outcome
                </Button>
              </HStack>
            </VStack>

            <Form.Textarea label="Description" name="description" placeholder="Description..." />

            <CalendarButton date={date} setDate={setDate} />
          </Form>
        </FormProvider>
      </Modal.Content>

      <Modal.Footer>
        <Button color="secondary" onClick={modal.close}>
          Cancel
        </Button>
        <Button type="submit" form={formId}>
          Save
        </Button>
      </Modal.Footer>

      <ChooseTemplate
        isOpen={templateModal.isOpen}
        close={templateModal.close}
        setTransaction={(template) => reset(getTemplateData(template))}
      />
    </Modal>
  );
};
