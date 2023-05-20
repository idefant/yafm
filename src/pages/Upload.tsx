import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { ChangeEvent, FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { bool, mixed, object, string, ValidationError } from 'yup';

import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setAccounts } from '../store/reducers/accountSlice';
import { setIsUnsaved, setPassword } from '../store/reducers/appSlice';
import { setCategories } from '../store/reducers/categorySlice';
import { setTransactions } from '../store/reducers/transactionSlice';
import { TCipher } from '../types/cipher';
import Button, { buttonColors } from '../UI/Button';
import GoBackButton from '../UI/Button/GoBackButton';
import EntranceTitle from '../UI/EntranceTitle';
import Form from '../UI/Form';
import { aesDecrypt } from '../utils/crypto';
import { readFileContent } from '../utils/file';
import yup from '../utils/form/schema';
import { checkBaseIntegrity } from '../utils/sync';

type TFileData = { created_at: string } & (
  | { data: TCipher; is_encrypted: true }
  | { data: any; is_encrypted: false }
);

type TForm = {
  password: string;
};

const formSchema = yup.object({
  password: yup.string().required(),
});

const Upload: FC = () => {
  const vaultUrl = useAppSelector((state) => state.app.vaultUrl);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit } = methods;

  const [fileData, setFileData] = useState<TFileData>();

  const getPlainData = (values: TForm) => {
    if (!fileData) return;
    if (!fileData.is_encrypted) return fileData.data;

    const { cipher, iv, hmac, salt } = fileData.data;
    const plaintext = aesDecrypt(cipher, values.password, iv, hmac, salt);

    if (!plaintext) {
      Swal.fire({ title: 'Wrong password', icon: 'error' });
      return;
    }

    return JSON.parse(plaintext);
  };

  const onSubmit = async (values: TForm) => {
    const data = getPlainData(values);
    if (!data) return;

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
    dispatch(setIsUnsaved(true));
    navigate('/');
  };

  const uploadBackup = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    if ('files' in input && input.files?.length && input.files?.length > 0) {
      readFileContent(input.files[0])
        .then(async (content) => {
          if (typeof content !== 'string') {
            Swal.fire({ title: 'Wrong Format', icon: 'error' });
            return;
          }

          const data = JSON.parse(content);
          const schema = object().shape({
            created_at: string().required(),
            is_encrypted: bool().required(),
            data: mixed().required(),
          });

          const error = await schema
            .validate(data)
            .then(() => undefined)
            .catch((err: ValidationError) => err.message);

          if (error) {
            Swal.fire({
              title: 'File Opening Error',
              text: error,
              icon: 'error',
            });
            return;
          }

          setFileData(data);
        })
        .catch(() => {
          Swal.fire({ title: 'File Opening Error', icon: 'error' });
        });
    }
  };

  return (
    <>
      <GoBackButton />
      <EntranceTitle>Upload Base</EntranceTitle>

      <FormProvider {...methods}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-3 mb-5">
            <div className="w-1/3">Server URL: </div>
            <div className="w-2/3">{vaultUrl}</div>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="w-1/3">Base:</div>
            <div className="w-2/3 flex gap-x-4 gap-y-1.5 flex-wrap items-center">
              <div>
                <input
                  type="file"
                  id="upload-enc-backup"
                  className="hidden"
                  onChange={uploadBackup}
                />
                <label
                  className={classNames('btn !py-1.5', buttonColors.green)}
                  htmlFor="upload-enc-backup"
                >
                  Upload Base
                </label>
              </div>
            </div>
          </div>

          {fileData && (
            <>
              <div className="flex gap-3 mb-3">
                <div className="w-1/3">Created at:</div>
                <div className="w-2/3">
                  {dayjs(fileData.created_at).format('DD.MM.YYYY (HH:mm)')}
                </div>
              </div>

              <div className="flex gap-3 mb-3">
                <div className="w-1/3">Properties:</div>
                <div className="w-2/3">{fileData.is_encrypted ? 'Encrypted' : 'Plaintext'}</div>
              </div>

              <Form.Password
                name="password"
                label={fileData.is_encrypted ? 'Password:' : 'New Password'}
                autoFocus
              />

              <div className="mx-auto mt-8 flex justify-center gap-6">
                <Button type="submit" color="green" className="block">
                  Open
                </Button>
              </div>
            </>
          )}
        </Form>
      </FormProvider>
    </>
  );
};

export default Upload;
