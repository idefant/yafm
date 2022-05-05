import { FC, useMemo, useRef, useState } from "react";
import Button from "../Generic/Button/Button";
import FormField, { FormFieldInput } from "../Generic/Form/FormField";
import Select from "../Generic/Form/Select";
import Textarea from "../Generic/Form/Textarea";
import Modal, {
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../Generic/Modal";
import {
  checkNeedIncome,
  checkNeedOutcome,
  TTemplate,
  TTransactionType,
} from "../../types/transactionType";
import "react-datepicker/dist/react-datepicker.css";
import { observer } from "mobx-react-lite";
import store from "../../store";
import { displayToSysValue, getCurrencyValue } from "../../helper/currencies";
import ActionButton from "../Generic/Button/ActionButton";
import { MinusIcon, PlusIcon, RepeatIcon } from "../../assets/svg";
import { useFormik } from "formik";
import { object, string } from "yup";
import { numberWithDecimalPlacesSchema } from "../../schema";

interface SetTemplateProps {
  template?: TTemplate;
  isOpen: boolean;
  close: () => void;
  startTransactionType?: TTransactionType;
}

const SetTemplate: FC<SetTemplateProps> = observer(
  ({ isOpen, close, template, startTransactionType }) => {
    const {
      account: { accounts, accountDict },
      currency: { currencyDict },
      category: { transactions: categories },
    } = store;

    const accountOptions = accounts.map((account) => ({
      value: account.id,
      text: account.name,
    }));

    const categoryOptions = categories
      .filter((category) => !category.is_archive)
      .map((category) => ({ value: category.id, text: category.name }));

    const [transactionType, setTransactionType] =
      useState<TTransactionType>("outcome");

    type TForm = {
      name: string;
      description: string;
      outcomeAccountId: string;
      outcomeSum: string;
      incomeAccountId: string;
      incomeSum: string;
      categoryId: string;
    };

    const onSubmit = (values: TForm) => {
      const templateData = {
        name: values.name || undefined,
        description: values.description || undefined,
        type: transactionType,
        category_id: values.categoryId || undefined,
        income:
          checkNeedIncome(transactionType) &&
          values.incomeAccountId &&
          incomeCurrency
            ? {
                account_id: values.incomeAccountId,
                sum: displayToSysValue(
                  values.incomeSum,
                  incomeCurrency.decimal_places_number
                ),
              }
            : undefined,
        outcome:
          checkNeedOutcome(transactionType) &&
          values.outcomeAccountId &&
          outcomeCurrency
            ? {
                account_id: values.outcomeAccountId,
                sum: displayToSysValue(
                  values.outcomeSum,
                  outcomeCurrency.decimal_places_number
                ),
              }
            : undefined,
      };

      if (template) {
        store.transaction.editTemplate({ ...template, ...templateData });
      } else {
        store.transaction.createTemplate(templateData);
      }
      close();
    };

    const outcomeDecimalPlaces = useRef(0);
    const incomeDecimalPlaces = useRef(0);

    const formik = useFormik({
      initialValues: {
        name: "",
        description: "",
        outcomeAccountId: "",
        outcomeSum: "",
        incomeAccountId: "",
        incomeSum: "",
        categoryId: "",
      },
      onSubmit,
      validationSchema: object({
        name: string(),
        description: string(),
        outcomeAccountId: checkNeedOutcome(transactionType)
          ? string().required()
          : string(),
        outcomeSum: checkNeedOutcome(transactionType)
          ? numberWithDecimalPlacesSchema(outcomeDecimalPlaces.current)
          : string(),
        incomeAccountId: checkNeedIncome(transactionType)
          ? string().required()
          : string(),
        incomeSum: checkNeedIncome(transactionType)
          ? numberWithDecimalPlacesSchema(incomeDecimalPlaces.current)
          : string(),
        categoryId: string(),
      }),
      validateOnChange: false,
      validateOnBlur: true,
    });

    const outcomeCurrency = useMemo(() => {
      const outcomeAccount = accountDict[formik.values.outcomeAccountId];
      const currency = outcomeAccount
        ? currencyDict[outcomeAccount.currency_code]
        : undefined;

      outcomeDecimalPlaces.current = currency?.decimal_places_number || 0;
      return currency;
    }, [accountDict, currencyDict, formik.values.outcomeAccountId]);

    const incomeCurrency = useMemo(() => {
      const incomeAccount = accountDict[formik.values.incomeAccountId];
      const currency = incomeAccount
        ? currencyDict[incomeAccount.currency_code]
        : undefined;

      incomeDecimalPlaces.current = currency?.decimal_places_number || 0;
      return currency;
    }, [accountDict, currencyDict, formik.values.incomeAccountId]);

    const onEnter = () => {
      const outcomeAccountId = template?.outcome?.account_id;
      const outcomeAccount = outcomeAccountId
        ? accountDict[outcomeAccountId]
        : undefined;
      const outcomeCurrency =
        outcomeAccount && currencyDict[outcomeAccount.currency_code];

      const incomeAccountId = template?.income?.account_id;
      const incomeAccount = incomeAccountId
        ? accountDict[incomeAccountId]
        : undefined;
      const incomeCurrency =
        incomeAccount && currencyDict[incomeAccount.currency_code];

      formik.setValues({
        name: template?.name || "",
        description: template?.description || "",
        outcomeAccountId: template?.outcome?.account_id || "",
        outcomeSum:
          template?.outcome?.sum && outcomeCurrency
            ? getCurrencyValue(
                template.outcome.sum,
                outcomeCurrency.decimal_places_number
              )
            : "",
        incomeAccountId: template?.income?.account_id || "",
        incomeSum:
          template?.income?.sum && incomeCurrency
            ? getCurrencyValue(
                template.income.sum,
                incomeCurrency.decimal_places_number
              )
            : "",
        categoryId: template?.category_id || "",
      });

      setTransactionType(startTransactionType || "outcome");
    };

    return (
      <Modal
        isOpen={isOpen}
        close={close}
        onEnter={onEnter}
        onSubmit={formik.handleSubmit}
      >
        <ModalHeader close={close}>
          {template ? "Edit Template" : "Create Template"}
        </ModalHeader>
        <ModalContent>
          <div className="flex justify-center gap-6">
            <ActionButton
              onClick={() => {
                setTransactionType("outcome");
                formik.setFieldError("incomeSum", undefined);
                formik.setFieldError("incomeAccountId", undefined);
              }}
              color="red"
              active={transactionType === "outcome"}
              shadow={transactionType === "outcome"}
            >
              <MinusIcon className="w-7 h-7" />
            </ActionButton>

            <ActionButton
              onClick={() => {
                setTransactionType("income");
                formik.setFieldError("outcomeSum", undefined);
                formik.setFieldError("outcomeAccountId", undefined);
              }}
              color="green"
              active={transactionType === "income"}
              shadow={transactionType === "income"}
            >
              <PlusIcon className="w-7 h-7" />
            </ActionButton>

            <ActionButton
              onClick={() => setTransactionType("exchange")}
              active={transactionType === "exchange"}
              shadow={transactionType === "exchange"}
            >
              <RepeatIcon className="w-7 h-7" />
            </ActionButton>
          </div>

          <FormField
            label="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
          />

          <div className="flex items-center my-2 gap-3">
            <label className="block w-1/3">Category</label>
            <Select
              selectedValue={formik.values.categoryId}
              name="categoryId"
              options={categoryOptions}
              onChange={formik.handleChange}
              className="w-2/3"
              useEmpty
              defaultText="Choose a category"
            />
          </div>

          {checkNeedOutcome(transactionType) && (
            <>
              <div className="text-xl pl-2 font-bold">Outcome</div>
              <div className="flex items-center my-2 gap-3">
                <Select
                  selectedValue={formik.values.outcomeAccountId}
                  options={accountOptions}
                  onChange={formik.handleChange}
                  className="w-1/3"
                  name="outcomeAccountId"
                  defaultText="Choose"
                  onBlur={() => formik.validateField("outcomeAccountId")}
                  withError={Boolean(formik.errors.outcomeAccountId)}
                />
                <div className="w-2/3 flex gap-4 items-center">
                  <FormFieldInput
                    name="outcomeSum"
                    value={formik.values.outcomeSum}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/,/g, ".")
                        .replace(/[^0-9. ]/g, "");
                      formik.setFieldValue("outcomeSum", value);
                    }}
                    onBlur={() => formik.validateField("outcomeSum")}
                    withError={Boolean(formik.errors.outcomeSum)}
                  />
                  {outcomeCurrency && <div>{outcomeCurrency.code}</div>}
                </div>
              </div>
            </>
          )}

          {checkNeedIncome(transactionType) && (
            <>
              <div className="text-xl pl-2 font-bold">Income</div>
              <div className="flex items-center my-2 gap-3">
                <Select
                  selectedValue={formik.values.incomeAccountId}
                  options={accountOptions}
                  onChange={formik.handleChange}
                  className="w-1/3"
                  name="incomeAccountId"
                  defaultText="Choose"
                  onBlur={() => formik.validateField("incomeAccountId")}
                  withError={Boolean(formik.errors.incomeAccountId)}
                />
                <div className="w-2/3 flex gap-4 items-center">
                  <FormFieldInput
                    name="incomeSum"
                    value={formik.values.incomeSum}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/,/g, ".")
                        .replace(/[^0-9. ]/g, "");
                      formik.setFieldValue("incomeSum", value);
                    }}
                    onBlur={() => formik.validateField("incomeSum")}
                    withError={Boolean(formik.errors.incomeSum)}
                  />
                  {incomeCurrency && <div>{incomeCurrency.code}</div>}
                </div>
              </div>
            </>
          )}

          <Textarea
            value={formik.values.description}
            name="description"
            onChange={formik.handleChange}
            placeholder="Description ..."
          />
        </ModalContent>
        <ModalFooter>
          <Button color="green" type="submit">
            Save
          </Button>
          <Button color="gray" onClick={close}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
);

export default SetTemplate;
