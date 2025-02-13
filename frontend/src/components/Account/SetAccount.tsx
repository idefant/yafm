import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAppSelector } from '#hooks/reduxHooks';
import { selectCurrencies, selectVisibleAccountCategories } from '#store/selectors';
import { Account } from '#types/accountType';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Modal, UseModalReturn } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';
import { groupBy } from '#utils/groupBy';
import { compareObjByStr } from '#utils/string';

export type SetAccountModalData =
  | { method: 'create'; account?: undefined }
  | { method: 'edit'; account: Account };

interface SetAccountProps {
  modal: UseModalReturn<SetAccountModalData>;
}

const formSchema = z.object({
  name: z.string().trim().nonempty(),
  currencyCode: z.string().nonempty(),
  categoryId: z.string().nullish(),
  isArchive: z.boolean().optional(),
});

type FormOutput = z.infer<typeof formSchema>;

export const SetAccount: FC<SetAccountProps> = ({ modal }) => {
  const formId = useId();

  const currencies = useAppSelector(selectCurrencies);
  const categories = useAppSelector(selectVisibleAccountCategories);

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: FormOutput) => {
    if (!modal.isOpen) return;
    const accountData = {
      name: values.name,
      category_id: values.categoryId || undefined,
      is_archive: values.isArchive || undefined,
    };

    committer(
      modal.data.method === 'create'
        ? actionCreator.createAccount({ currency_code: values.currencyCode || '', ...accountData })
        : actionCreator.updateAccount(modal.data.account.id, accountData),
    ).sync();
    modal.close();
  };

  const currencyOptGroups = Object.entries(groupBy(currencies, 'type')).map(
    ([currencyType, currencies]) => ({
      label: currencyType,
      options: currencies.map((currency) => ({ value: currency.code, label: currency.name })),
    }),
  );

  const categoryOptions = categories
    .sort((a, b) => compareObjByStr(a, b, (e) => e.name))
    .map((category) => ({ value: category.id, label: category.name }));

  const onOpening = () => {
    if (!modal.isOpen) return;
    reset({
      name: modal.data.account?.name || '',
      currencyCode: modal.data.account?.currency_code || '',
      categoryId: modal.data.account?.category_id || null,
      isArchive: modal.data.account?.is_archive || false,
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
              label="Category"
              placeholder="Choose category..."
              options={categoryOptions}
              isClearable
              name="categoryId"
            />

            {modal.data?.method === 'edit' && (
              <Form.Checkbox name="isArchive">Archive</Form.Checkbox>
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
