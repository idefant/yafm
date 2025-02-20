import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Category } from '#types/categoryType';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Modal, UseModalReturn } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';

export type SetCategoryModalData =
  | {
      method: 'create';
      category?: undefined;
    }
  | {
      method: 'edit';
      category: Category;
    };

interface SetCategoryProps {
  modal: UseModalReturn<SetCategoryModalData>;
}

const formSchema = z.object({
  name: z.string().trim().nonempty(),
  isArchived: z.boolean().nullish(),
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
      isArchived: values.isArchived || undefined,
    };

    committer(
      modal.data.method === 'create'
        ? actionCreator.createCategory(categoryData)
        : actionCreator.updateCategory(modal.data.category.id, categoryData),
    ).sync();
    modal.close();
  };

  const onOpen = () => {
    if (!modal.isOpen) return;
    reset({
      name: modal.data.category?.name || '',
      isArchived: modal.data.category?.isArchived || false,
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
