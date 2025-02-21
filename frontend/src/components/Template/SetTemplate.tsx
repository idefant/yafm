import { zodResolver } from '@hookform/resolvers/zod';
import BigNumber from 'bignumber.js';
import { FC, useId } from 'react';
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAllAccountsExtended,
  selectAllAccountsExtendedEntities,
  selectAllCategories,
} from '#store/selectors';
import MinusIcon from '#svg/minus.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { Template } from '#types/templateType';
import { Transaction } from '#types/transactionType';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Grid } from '#ui/Grid';
import { IconButton } from '#ui/IconButton';
import { Modal, UseModalReturn } from '#ui/Modal';
import { HStack, VStack } from '#ui/Stack';
import { actionCreator, committer } from '#utils/committer';

export type SetTemplateModalData =
  | { method: 'create'; template?: undefined; transaction?: undefined }
  | { method: 'createFromTransaction'; template?: undefined; transaction: Transaction }
  | { method: 'edit'; template: Template; transaction?: undefined };

interface SetTemplateProps {
  modal: UseModalReturn<SetTemplateModalData>;
}

const formSchema = z.object({
  name: z.string().trim(),
  category: z
    .object({
      id: z.string().optional(),
      isCreated: z.boolean().optional(),
    })
    .optional(),
  operations: z
    .array(
      z.object({
        isPositive: z.boolean(),
        accountId: z.string().nonempty().optional(),
        sum: z.string().optional(),
      }),
    )
    .nonempty(),
  description: z.string(),
});

type FormOutput = z.infer<typeof formSchema>;

const defaultOperations = [{ accountId: '', sum: undefined, isPositive: false }];

export const SetTemplate: FC<SetTemplateProps> = ({ modal }) => {
  const formId = useId();

  const accounts = useAppSelector(selectAllAccountsExtended);
  const accountsEntities = useAppSelector(selectAllAccountsExtendedEntities);
  const categories = useAppSelector(selectAllCategories);

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { control, handleSubmit, reset, setValue } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'operations',
  });

  const operationsWatcher = useWatch({ control, name: 'operations' });

  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: account.name,
    isArchived: account.isArchived,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSubmit = async (values: FormOutput) => {
    if (!modal.isOpen) return;
    const commit = committer();

    const categoryId = (() => {
      if (values.category?.isCreated) {
        const actionCreateCategory = actionCreator.createCategory({
          name: values.category.id!,
        });
        commit.add(actionCreateCategory);
        return actionCreateCategory.id;
      }
      return values.category?.id;
    })();

    const templateData = {
      name: values.name || undefined,
      description: values.description || undefined,
      categoryId: categoryId || undefined,
      operations: values.operations.map((operation) => ({
        accountId: operation.accountId || undefined,
        sum: operation.sum
          ? BigNumber(operation.sum)
              .multipliedBy(operation.isPositive ? 1 : -1)
              .toString()
          : undefined,
      })),
    };

    commit.add(
      modal.data.method === 'edit'
        ? actionCreator.updateTemplate(modal.data.template.id, templateData)
        : actionCreator.createTemplate(templateData),
    );
    commit.sync();

    modal.close();
  };

  const onOpening = () => {
    if (!modal.isOpen) return;

    const initialData = modal.data.transaction || modal.data.template;

    const initialOperations = initialData?.operations.map((operation) => ({
      accountId: operation?.accountId,
      sum: operation.sum ? BigNumber(operation.sum).abs().toString() : '',
      isPositive: operation.sum ? BigNumber(operation.sum).isPositive() : false,
    }));

    reset({
      name: initialData?.name || '',
      description: initialData?.description || '',
      operations: initialOperations || defaultOperations,
      category: {
        id: initialData?.categoryId || '',
        isCreated: false,
      },
    });
  };

  return (
    <Modal
      title={modal.data?.method === 'edit' ? 'Edit Template' : 'Create Template'}
      isOpen={modal.isOpen}
      close={modal.close}
      onOpening={onOpening}
    >
      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
          <Modal.Content>
            <Form.Input label="Name" name="name" />

            <Form.SelectCreatable
              label="Category"
              placeholder="Choose category..."
              options={categoryOptions}
              isClearable
              nameId="category.id"
              nameIsCreated="category.isCreated"
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
                            if (option.data.isArchived) return false;
                            return option.label.toLowerCase().includes(inputValue.toLowerCase());
                          }}
                        />
                      </Grid.Item>
                      <Grid.Item size={6}>
                        <Form.Number
                          label={i === 0 ? 'Amount' : undefined}
                          name={`operations.${i}.sum`}
                          decimalScale={currency?.decimalPlaces}
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
                  onClick={() => append({ accountId: '', sum: undefined as any, isPositive: true })}
                >
                  Income
                </Button>

                <Button
                  color="danger"
                  startIcon={<MinusIcon />}
                  onClick={() =>
                    append({ accountId: '', sum: undefined as any, isPositive: false })
                  }
                >
                  Outcome
                </Button>
              </HStack>
            </VStack>

            <Form.Textarea label="Description" name="description" placeholder="Description..." />
          </Modal.Content>

          <Modal.Footer>
            <Button color="secondary" onClick={modal.close}>
              Cancel
            </Button>
            <Button type="submit" form={formId}>
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </FormProvider>
    </Modal>
  );
};
