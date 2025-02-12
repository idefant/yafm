import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';
import { compileBase } from '#utils/compileBase';
import { crypt } from '#utils/crypt';
import yup from '#utils/form/schema';

type TForm = {
  password: string;
};

const formSchema = yup
  .object({
    password: yup.string().required(),
  })
  .required();

export const Decrypt: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: commits, isLoading: isLoadingCommits } = useFetchCommitsQuery(
    {},
    { refetchOnMountOrArgChange: true },
  );

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const isNew = !commits?.length;

  const onSubmit = async (values: TForm) => {
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
        Swal.fire({ title: 'Wrong password', icon: 'error' });
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
      Swal.fire({ title: 'Invalid base data', icon: 'error' });
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
      <Title level={4}>{isNew ? 'Create Base' : 'Decrypt Base'}</Title>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Password name="password" label={isNew ? 'New Password:' : 'Password:'} autoFocus />

          <div className="mx-auto mt-8 flex justify-center gap-6">
            <Button type="submit">{isNew ? 'Create new Base' : 'Decrypt'}</Button>
          </div>
        </Form>
      </FormProvider>
    </>
  );
};
