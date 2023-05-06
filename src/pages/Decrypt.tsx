import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { FC, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { object, string } from 'yup';

import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import useAsyncEff from '../hooks/useAsyncEffect';
import { setAccounts } from '../store/reducers/accountSlice';
import { setPassword, setVaultUrl } from '../store/reducers/appSlice';
import { setCategories } from '../store/reducers/categorySlice';
import { setTransactions } from '../store/reducers/transactionSlice';
import { TCipher } from '../types/cipher';
import Button from '../UI/Button';
import ButtonLink from '../UI/Button/ButtonLink';
import Details from '../UI/Details';
import EntranceTitle from '../UI/EntranceTitle';
import FormField from '../UI/Form/FormField';
import { aesDecrypt } from '../utils/crypto';
import { getBaseRequest, getVersionByFilenameRequest } from '../utils/requests/versionRequests';
import { checkBaseIntegrity } from '../utils/sync';
import { isValidUrl } from '../utils/url';

const Decrypt: FC = () => {
  const { vaultUrl, isVaultWorking, isVersioningEnabled } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const defaultVaultUrl = process.env.REACT_APP_SERVER_URL;

  const [cipherData, setCipherData] = useState<TCipher & { created_at: string }>();

  const [isNew, setIsNew] = useState<boolean>();
  const { versionId } = useParams();

  useAsyncEff(async () => {
    if (isVaultWorking) {
      const response = await (versionId
        ? getVersionByFilenameRequest(versionId, vaultUrl)
        : getBaseRequest(vaultUrl));
      if (!response) return;

      if (!response.data) {
        setIsNew(true);
      } else {
        setIsNew(false);
        setCipherData(response.data);
      }
    }
  }, [versionId, isVaultWorking, vaultUrl]);

  type TForm = { password: string };

  const submitForm = async (values: TForm) => {
    if (isNew) {
      dispatch(setPassword(values.password));
      return;
    }

    if (cipherData) {
      const plaintext = aesDecrypt(
        cipherData.cipher,
        values.password,
        cipherData.iv,
        cipherData.hmac,
        cipherData.salt,
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
    }
  };

  const changeVaultUrl = () => {
    Swal.fire({
      title: 'Vault URL Config',
      input: 'text',
      inputPlaceholder: defaultVaultUrl,
      inputValue: vaultUrl,
      confirmButtonText: 'Check URL',
      showCancelButton: true,
      preConfirm: (url) => {
        if (!isValidUrl(url)) {
          Swal.showValidationMessage('Wrong URL');
        } else {
          dispatch(setVaultUrl(url));
          setIsNew(undefined);
        }
      },
    });
  };

  const formik = useFormik({
    initialValues: { password: '' },
    onSubmit: submitForm,
    validationSchema: object({ password: string().required() }),
    validateOnChange: false,
    validateOnBlur: true,
  });

  return isNew === undefined ? (
    <>Loading...</>
  ) : (
    <>
      <EntranceTitle>{isNew ? 'Create Base' : 'Decrypt Base'}</EntranceTitle>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex gap-3 mb-3">
          <div className="w-1/3">Vault URL:</div>
          <div className="w-2/3">{vaultUrl}</div>
        </div>

        {!isNew && (
          <div className="flex gap-3 mb-3">
            <div className="w-1/3">Version:</div>
            <div className="w-2/3 flex gap-x-4 gap-y-1.5 flex-wrap items-center">
              {versionId ? dayjs(cipherData?.created_at).format('DD.MM.YYYY (HH:mm)') : 'Last'}
            </div>
          </div>
        )}

        <FormField
          label={isNew ? 'New Password:' : 'Password:'}
          value={formik.values.password}
          name="password"
          onChange={formik.handleChange}
          type="password"
          onBlur={() => formik.validateField('password')}
          withError={Boolean(formik.errors.password)}
        />

        <Details title="Advances">
          <div className="flex gap-3 flex-wrap">
            {isVersioningEnabled && (
              <ButtonLink
                to="/versions"
                color="yellow"
                className="text-sm !px-2.5 !py-1.5 rounded-lg"
              >
                Choose old version
              </ButtonLink>
            )}

            <ButtonLink to="/upload" className="text-sm !px-2.5 !py-1.5 rounded-lg" color="green">
              Upload Version
            </ButtonLink>

            <Button
              color="gray"
              className="text-sm !px-2.5 !py-1.5 rounded-lg"
              onClick={changeVaultUrl}
            >
              Change Vault Url
            </Button>
          </div>
        </Details>

        <div className="mx-auto mt-8 flex justify-center gap-6">
          <Button type="submit" color="green" className="block">
            {isNew ? 'Create new Base' : 'Decrypt'}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Decrypt;
