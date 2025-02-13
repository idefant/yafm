import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Category, CategoryType } from '#types/categoryType';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Modal, UseModalReturn } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';

export type SetCategoryModalData =
  | {
      method: 'create';
      category?: undefined;
      categoryType: CategoryType;
    }
  | {
      method: 'edit';
      category: Category;
      categoryType: CategoryType;
    };

interface SetCategoryProps {
  modal: UseModalReturn<SetCategoryModalData>;
}

const formSchema = z.object({
  name: z.string().trim().nonempty(),
  isArchive: z.boolean().nullish(),
});

type FormOutput = z.infer<typeof formSchema>;

export const SetCategory: FC<SetCategoryProps> = ({ modal }) => {
  const formId = useId();

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: FormOutput) => {
    if (!modal.isOpen) return;

    const categoryData = {
      name: values.name,
      is_archive: values.isArchive || undefined,
    };

    if (modal.data.method === 'create') {
      if (modal.data.categoryType === 'accounts') {
        committer(actionCreator.createAccountCategory(categoryData)).sync();
      }
      if (modal.data.categoryType === 'transactions') {
        committer(actionCreator.createTransactionCategory(categoryData)).sync();
      }
    } else {
      if (modal.data.categoryType === 'accounts') {
        committer(actionCreator.updateAccountCategory(modal.data.category.id, categoryData)).sync();
      }
      if (modal.data.categoryType === 'transactions') {
        committer(
          actionCreator.updateTransactionCategory(modal.data.category.id, categoryData),
        ).sync();
      }
    }
    modal.close();
  };

  const onOpen = () => {
    if (!modal.isOpen) return;
    reset({
      name: modal.data.category?.name || '',
      isArchive: modal.data.category?.is_archive || false,
    });
  };

  return (
    <Modal
      title={modal.data?.method === 'create' ? 'Create Category' : 'Edit Category'}
      isOpen={modal.isOpen}
      close={modal.close}
      onOpen={onOpen}
    >
      <Modal.Content>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Form.Input label="Name" name="name" />

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
