import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useFetchCommitsQuery } from '#api/mainApi';
import { appRoutes } from '#data/routes';
import { useAppDispatch } from '#hooks/reduxHooks';
import { accountCategoriesReceived } from '#store/reducers/accountCategoriesSlice';
import { accountsReceived } from '#store/reducers/accountsSlice';
import { unlockBase } from '#store/reducers/appSlice';
import { currenciesReceived, setBaseCurrency } from '#store/reducers/currenciesSlice';
import { transactionCategoriesReceived } from '#store/reducers/transactionCategoriesSlice';
import { transactionsReceived } from '#store/reducers/transactionsSlice';
import { transactionTemplatesReceived } from '#store/reducers/transactionTemplatesSlice';
import { Commit, CommitAction, updatedBaseMethods } from '#types/commitType';
import { Alert } from '#ui/Alert';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { dmodal } from '#ui/Modal';
import { HStack } from '#ui/Stack';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import { compileBase } from '#utils/compileBase';
import { crypt } from '#utils/crypt';

const formSchema = z.object({
  password: z.string().nonempty(),
});

type FormOutput = z.infer<typeof formSchema>;

export const Decrypt: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [alertText, setAlertText] = useState<string>();

  const { data: commits, isLoading: isLoadingCommits } = useFetchCommitsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const isNew = !commits?.length;

  const onSubmit = async (values: FormOutput) => {
    setAlertText(undefined);
    if (isNew) {
      await crypt.setSecret({ password: values.password });

      await committer(actionCreator.initBase()).sync();
      dispatch(unlockBase());
      return;
    }

    const decryptedCommits: Commit[] = [];

    await crypt.setSecret({ password: values.password, salt: commits[0].salt });

    for await (const commit of commits.toReversed()) {
      const decryptedCommit = await committer.decrypt(commit);

      if (!decryptedCommit) {
        setAlertText('Wrong password');
        reset({ password: '' });
        return;
      }

      // XXX: Тут должна быть проверка на целостность типа
      const updatedBaseActionIndex = decryptedCommit.actions.findIndex(({ action }) =>
        updatedBaseMethods.some((method) => method === action.method),
      );

      if (updatedBaseActionIndex !== -1) {
        decryptedCommits.push({
          createdAt: decryptedCommit.date,
          actions: decryptedCommit.actions
            .slice(updatedBaseActionIndex)
            .map(({ action }) => action) as CommitAction[],
        });
        break;
      }
      decryptedCommits.push({
        createdAt: decryptedCommit.date,
        actions: decryptedCommit.actions.map(({ action }) => action) as CommitAction[],
      });
    }

    const base = compileBase(decryptedCommits.toReversed());
    if (!base) {
      dmodal.error({
        title: 'Invalid base data',
        showCancel: false,
      });
      return;
    }

    dispatch(currenciesReceived(base.currencies));
    dispatch(setBaseCurrency(base.baseCurrencyCode));
    dispatch(accountsReceived(base.accounts));
    dispatch(accountCategoriesReceived(base.categories.accounts));
    dispatch(transactionsReceived(base.transactions));
    dispatch(transactionCategoriesReceived(base.categories.transactions));
    dispatch(transactionTemplatesReceived(base.templates));
    dispatch(unlockBase());

    navigate(appRoutes.dashboard);
  };

  return isLoadingCommits ? (
    <>Loading...</>
  ) : (
    <>
      <Title level={4} gutterBottom>
        {isNew ? 'Create Base' : 'Decrypt Base'}
      </Title>

      <Alert text={alertText} />

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Password name="password" label={isNew ? 'New Password:' : 'Password:'} autoFocus />

          <HStack justify="center">
            <Button type="submit">{isNew ? 'Create new Base' : 'Decrypt'}</Button>
          </HStack>
        </Form>
      </FormProvider>
    </>
  );
};
