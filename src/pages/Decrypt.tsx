import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useFetchInfoQuery } from '#api/userApi';
import { useAppDispatch } from '#hooks/reduxHooks';
import { setAccounts } from '#store/reducers/accountSlice';
import { setPassword } from '#store/reducers/appSlice';
import { setCategories } from '#store/reducers/categorySlice';
import { setTransactions } from '#store/reducers/transactionSlice';
import Button from '#ui/Button';
import EntranceTitle from '#ui/EntranceTitle';
import Form from '#ui/Form';
import { aesDecrypt } from '#utils/crypto';
import yup from '#utils/form/schema';
import Gzip from '#utils/gzip';
import { checkBaseIntegrity } from '#utils/sync';

type TForm = {
  password: string;
};

const formSchema = yup
  .object({
    password: yup.string().required(),
  })
  .required();

const Decrypt: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { data: user, isLoading } = useFetchInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit } = methods;

  const { versionId } = useParams();

  const isNew = !user?.bases.length;

  const onSubmit = async (values: TForm) => {
    if (isNew) {
      dispatch(setPassword(values.password));
      return;
    }
    const base = user.bases[0];

    const plaintext = await Gzip.decompress(
      aesDecrypt(base.cipher, values.password, base.iv, base.hmac, base.salt),
    );

    if (plaintext) {
      const data = JSON.parse(plaintext);
      const validatedStatus = await checkBaseIntegrity(data);
      if (validatedStatus) {
        Swal.fire({
          title: 'Validate Error',
          text: validatedStatus.error,
          icon: 'error',
        });
        return;
      }

      dispatch(setPassword(values.password));
      dispatch(setAccounts(data.accounts));
      dispatch(
        setTransactions({
          transactions: data.transactions,
          templates: data.templates,
        }),
      );
      dispatch(setCategories(data.categories));

      navigate('/');
    } else {
      Swal.fire({ title: 'Wrong password', icon: 'error' });
    }
  };

  const oldBase = user?.bases.find((base) => base.id === versionId);

  return isLoading ? (
    <>Loading...</>
  ) : (
    <>
      <EntranceTitle>{isNew ? 'Create Base' : 'Decrypt Base'}</EntranceTitle>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {!isNew && (
            <div className="flex gap-3 mb-3">
              <div className="w-1/3">Base Version:</div>
              <div className="w-2/3 flex gap-x-4 gap-y-1.5 flex-wrap items-center">
                {versionId && oldBase
                  ? dayjs(oldBase.createdAt).format('DD.MM.YYYY (HH:mm)')
                  : 'Last'}
              </div>
            </div>
          )}

          <Form.Password name="password" label={isNew ? 'New Password:' : 'Password:'} autoFocus />

          <div className="mx-auto mt-8 flex justify-center gap-6">
            <Button type="submit" color="green" className="block">
              {isNew ? 'Create new Base' : 'Decrypt'}
            </Button>
          </div>
        </Form>
      </FormProvider>
    </>
  );
};

export default Decrypt;
