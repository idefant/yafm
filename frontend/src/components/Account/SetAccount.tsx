import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAppSelector } from '#hooks/reduxHooks';
import { selectCurrencies, selectVisibleAccountGroups } from '#store/selectors';
import { Account } from '#types/accountType';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Modal, UseModalReturn } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';
import { groupBy } from '#utils/groupBy';

export type SetAccountModalData =
  | { method: 'create'; account?: undefined }
  | { method: 'edit'; account: Account };

interface SetAccountProps {
  modal: UseModalReturn<SetAccountModalData>;
}

const formSchema = z.object({
  name: z.string().trim().nonempty(),
  currencyCode: z.string().nonempty(),
  groupId: z.string().nullish(),
  isArchived: z.boolean().optional(),
});

type FormOutput = z.infer<typeof formSchema>;

export const SetAccount: FC<SetAccountProps> = ({ modal }) => {
  const formId = useId();

  const currencies = useAppSelector(selectCurrencies);
  const groups = useAppSelector(selectVisibleAccountGroups);

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: FormOutput) => {
    if (!modal.isOpen) return;
    const accountData = {
      name: values.name,
      groupId: values.groupId || undefined,
      isArchived: values.isArchived || undefined,
    };

    committer(
      modal.data.method === 'create'
        ? actionCreator.createAccount({ currencyCode: values.currencyCode, ...accountData })
        : actionCreator.updateAccount(modal.data.account.id, accountData),
    ).sync();
    modal.close();
  };

  const currencyOptGroups = Object.entries(groupBy(currencies, (currency) => currency.type)).map(
    ([currencyType, currencies]) => ({
      label: currencyType,
      options: currencies.map((currency) => ({ value: currency.code, label: currency.name })),
    }),
  );

  const groupOptions = groups.map((group) => ({ value: group.id, label: group.name }));

  const onOpening = () => {
    if (!modal.isOpen) return;
    reset({
      name: modal.data.account?.name || '',
      currencyCode: modal.data.account?.currencyCode || '',
      groupId: modal.data.account?.groupId || null,
      isArchived: modal.data.account?.isArchived || false,
    });
  };

  return (
    <Modal
      title={modal.data?.method === 'create' ? 'Create Account' : 'Edit Account'}
      isOpen={modal.isOpen}
      close={modal.close}
      onOpening={onOpening}
    >
      <Modal.Content>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Form.Input label="Name" name="name" />
            {modal.data?.method === 'create' && (
              <Form.Select
                label="Currency"
                placeholder="Choose currency..."
                options={currencyOptGroups}
                name="currencyCode"
              />
            )}

            <Form.Select
              label="Group"
              placeholder="Choose group..."
              options={groupOptions}
              isClearable
              name="groupId"
            />

            {modal.data?.method === 'edit' && (
              <Form.Checkbox name="isArchived">Archive</Form.Checkbox>
            )}
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
    </Modal>
  );
};
