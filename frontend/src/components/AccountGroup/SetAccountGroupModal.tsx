import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { AccountGroup } from '#types/accountGroupType';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Modal, UseModalReturn } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';

export type SetAccountGroupModalData =
  | {
      method: 'create';
      group?: undefined;
    }
  | {
      method: 'edit';
      group: AccountGroup;
    };

interface SetAccountGroupModalProps {
  modal: UseModalReturn<SetAccountGroupModalData>;
}

const formSchema = z.object({
  name: z.string().trim().nonempty(),
});

type FormOutput = z.infer<typeof formSchema>;

export const SetAccountGroupModal: FC<SetAccountGroupModalProps> = ({ modal }) => {
  const formId = useId();

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: FormOutput) => {
    if (!modal.isOpen) return;

    const groupData = {
      name: values.name,
    };

    committer(
      modal.data.method === 'create'
        ? actionCreator.createAccountGroup(groupData)
        : actionCreator.updateAccountGroup(modal.data.group.id, groupData),
    ).sync();
    modal.close();
  };

  const onOpen = () => {
    if (!modal.isOpen) return;
    reset({
      name: modal.data.group?.name || '',
    });
  };

  return (
    <Modal
      title={modal.data?.method === 'create' ? 'Create Account Group' : 'Edit Account Group'}
      isOpen={modal.isOpen}
      close={modal.close}
      onOpen={onOpen}
    >
      <Modal.Content>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Form.Input label="Name" name="name" />
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
