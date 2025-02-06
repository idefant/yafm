import { yupResolver } from '@hookform/resolvers/yup';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useAppSelector } from '#hooks/reduxHooks';
import { Currency, CurrencyType, currencyTypes } from '#types/currencyType';
import { Button } from '#ui/Button';
import Form from '#ui/Form';
import { Modal } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';
import yup from '#utils/form/schema';

export type OpenedCurrency =
  | { method: 'create'; currency: { name: string; code: string } }
  | { method: 'update'; currency: Currency };

interface SetCurrencyProps {
  isOpen: boolean;
  close: () => void;
  data?: OpenedCurrency;
}

type TForm = {
  name: string;
  decimalPlacesNumber: number;
  type: CurrencyType;
  color: string;
  symbol: string;
  isBaseCurrency: boolean;
};

const formSchema = yup.object({
  name: yup.string().required(),
  decimalPlacesNumber: yup.number().positive().required(),
  type: yup.string().oneOf(currencyTypes).required(),
  color: yup.string(),
  symbol: yup.string(),
  isBaseCurrency: yup.boolean().required(),
});

const SetCurrency: FC<SetCurrencyProps> = ({ isOpen, close, data }) => {
  const formId = useId();

  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);

  const methods = useForm<TForm>({ resolver: yupResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: TForm) => {
    if (!data) return;

    const currencyData = {
      name: values.name,
      decimal_places_number: values.decimalPlacesNumber,
      type: values.type,
      color: values.color || 'gray',
      symbol: values.symbol || data.currency.code,
    };

    const commit = committer();

    if (data.method === 'update') {
      commit.add(actionCreator.updateCurrency(data.currency.code, currencyData));
    } else {
      commit.add(actionCreator.createCurrency({ code: data.currency.code, ...currencyData }));
    }

    if (values.isBaseCurrency) {
      commit.add(actionCreator.setBasicCurrency(data.currency.code));
    }
    commit.sync();
    close();
  };

  const onOpening = () => {
    if (!data) return;

    reset(
      data.method === 'create'
        ? {
            name: data.currency.name,
            symbol: data.currency.code,
            decimalPlacesNumber: 2,
            type: 'fiat',
            color: '',
            isBaseCurrency: false,
          }
        : {
            name: data.currency.name,
            symbol: data.currency.symbol,
            decimalPlacesNumber: data.currency.decimal_places_number,
            type: data.currency.type,
            color: data.currency.color,
            isBaseCurrency: data.currency.code === baseCurrencyCode,
          },
    );
  };

  const onExited = () => reset();

  return (
    <Modal
      title={data?.method === 'update' ? 'Edit Currency' : 'Create Currency'}
      isOpen={isOpen}
      close={close}
      onOpening={onOpening}
      onExited={onExited}
    >
      <Modal.Content>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Input label="Name" name="name" />
            <Form.Input label="Symbol" name="symbol" />
            <Form.Number
              label="Number of decimal places"
              name="decimalPlacesNumber"
              decimalScale={0}
            />

            <Form.Select
              label="Currency type"
              placeholder="Choose currency type..."
              options={[
                { value: 'fiat', label: 'Fiat' },
                { value: 'crypto', label: 'Crypto' },
              ]}
              name="type"
            />

            <Form.Input label="Color" name="color" />

            <Form.Checkbox
              name="isBaseCurrency"
              disabled={data?.currency.code === baseCurrencyCode}
            >
              Base Currency
            </Form.Checkbox>
          </Form>
        </FormProvider>
      </Modal.Content>

      <Modal.Footer>
        <Button color="secondary" onClick={close}>
          Cancel
        </Button>
        <Button type="submit" form={formId}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SetCurrency;
