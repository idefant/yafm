import { useFormik } from "formik";
import dayjs from "dayjs";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { object, string } from "yup";
import Swal from "sweetalert2";

import { aesDecrypt } from "../../helper/crypto";
import {
  getBaseRequest,
  getVersionByFilenameRequest,
} from "../../helper/requests/versionRequests";
import { checkBaseIntegrity } from "../../helper/sync";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { setCategories } from "../../store/reducers/categorySlice";
import { setAccounts } from "../../store/reducers/accountSlice";
import { setTransactions } from "../../store/reducers/transactionSlice";
import { TCipher } from "../../types/cipher";
import Button from "../Generic/Button/Button";
import FormField from "../Generic/Form/FormField";
import Details from "../Generic/Details";
import ButtonLink from "../Generic/Button/ButtonLink";
import { setPassword, setVaultUrl } from "../../store/reducers/appSlice";
import { isValidUrl } from "../../helper/url";

const Decrypt: FC = () => {
  const { vaultUrl, isVaultWorking, isVersioningEnabled } = useAppSelector(
    (state) => state.app
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const defaultVaultUrl = process.env.REACT_APP_SERVER_URL;

  const [cipherData, setCipherData] = useState<
    TCipher & { created_at: string }
  >();

  const [isNew, setIsNew] = useState<boolean>();
  const { versionId } = useParams();

  useEffect(() => {
    if (isVaultWorking) {
      (async () => {
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
      })();
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
        cipherData.salt
      );

      if (plaintext) {
        const data = JSON.parse(plaintext);
        const validatedStatus = await checkBaseIntegrity(data);
        if (validatedStatus) {
          Swal.fire({
            title: "Validate Error",
            text: validatedStatus.error,
            icon: "error",
          });
          return;
        }

        dispatch(setPassword(values.password));
        dispatch(setAccounts(data.accounts));
        dispatch(
          setTransactions({
            transactions: data.transactions,
            templates: data.templates,
          })
        );
        dispatch(setCategories(data.categories));

        navigate("/");
      } else {
        Swal.fire({ title: "Wrong password", icon: "error" });
      }
    }
  };

  const changeVaultUrl = () => {
    Swal.fire({
      title: "Vault URL Config",
      input: "text",
      inputPlaceholder: defaultVaultUrl,
      inputValue: vaultUrl,
      confirmButtonText: "Check URL",
      showCancelButton: true,
      preConfirm: (url) => {
        if (!isValidUrl(url)) {
          Swal.showValidationMessage(`Wrong URL`);
        } else {
          dispatch(setVaultUrl(url));
          setIsNew(undefined);
        }
      },
    });
  };

  const formik = useFormik({
    initialValues: { password: "" },
    onSubmit: submitForm,
    validationSchema: object({ password: string().required() }),
    validateOnChange: false,
    validateOnBlur: true,
  });

  return isNew === undefined ? (
    <>Loading...</>
  ) : (
    <>
      <h1 className="text-3xl font-bold underline text-center mb-7">
        {isNew ? "Create Base" : "Decrypt Base"}
      </h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex gap-3 mb-3">
          <div className="w-1/3">Server URL: </div>
          <div className="w-2/3">{vaultUrl}</div>
        </div>

        {!isNew && (
          <div className="flex gap-3 mb-3">
            <div className="w-1/3">Version:</div>
            <div className="w-2/3 flex gap-x-4 gap-y-1.5 flex-wrap items-center">
              {versionId
                ? dayjs(cipherData?.created_at).format("DD.MM.YYYY (HH:mm)")
                : "Last"}
            </div>
          </div>
        )}

        <FormField
          label={isNew ? "New Password:" : "Password:"}
          value={formik.values.password}
          name="password"
          onChange={formik.handleChange}
          type="password"
          onBlur={() => formik.validateField("password")}
          withError={Boolean(formik.errors.password)}
        />

        <Details title="Advances">
          <div className="flex gap-3 flex-wrap">
            {isVersioningEnabled && (
              <ButtonLink
                to="/versions"
                className="text-sm !px-2.5 !py-1.5 rounded-lg bg-amber-300 inline-block"
              >
                Choose old version
              </ButtonLink>
            )}

            <ButtonLink
              to="/upload"
              className="text-sm !px-2.5 !py-1.5 rounded-lg inline-block"
              color="green"
            >
              Upload Version
            </ButtonLink>

            <Button
              color="gray"
              className="text-sm !px-2.5 !py-1.5 rounded-lg inline-block"
              onClick={changeVaultUrl}
            >
              Change Vault Url
            </Button>
          </div>
        </Details>

        <div className="mx-auto mt-8 flex justify-center gap-6">
          <Button type="submit" color="green" className="block">
            {isNew ? "Create new Base" : "Decrypt"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default Decrypt;
