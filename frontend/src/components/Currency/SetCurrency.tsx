import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAppSelector } from '#hooks/reduxHooks';
import { Currency, currencyTypes } from '#types/currencyType';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Modal, UseModalReturn } from '#ui/Modal';
import { actionCreator, committer } from '#utils/committer';

export type SetCurrencyModalData =
  | { method: 'create'; currency: { name: string; code: string } }
  | { method: 'edit'; currency: Currency };

interface SetCurrencyProps {
  modal: UseModalReturn<SetCurrencyModalData>;
}

const formSchema = z.object({
  name: z.string().trim().nonempty(),
  decimalPlacesNumber: z.coerce.number().nonnegative().int(),
  type: z.enum(currencyTypes),
  color: z.string().nullish(),
  symbol: z.string().trim().nonempty(),
  isBaseCurrency: z.boolean(),
});

type FormOutput = z.infer<typeof formSchema>;

export const SetCurrency: FC<SetCurrencyProps> = ({ modal }) => {
  const formId = useId();

  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: FormOutput) => {
    if (!modal.isOpen) return;

    const currencyData = {
      name: values.name,
      decimal_places_number: values.decimalPlacesNumber,
      type: values.type,
      color: values.color || 'gray',
      symbol: values.symbol || modal.data.currency.code,
    };

    const commit = committer();

    commit.add(
      modal.data.method === 'create'
        ? actionCreator.createCurrency({ code: modal.data.currency.code, ...currencyData })
        : actionCreator.updateCurrency(modal.data.currency.code, currencyData),
    );

    if (values.isBaseCurrency) {
      commit.add(actionCreator.setBasicCurrency(modal.data.currency.code));
    }
    commit.sync();
    modal.close();
  };

  const onOpening = () => {
    if (!modal.isOpen) return;
    reset(
      modal.data.method === 'create'
        ? {
            name: modal.data.currency.name,
            symbol: modal.data.currency.code,
            decimalPlacesNumber: 2,
            type: 'fiat',
            color: '',
            isBaseCurrency: false,
          }
        : {
            name: modal.data.currency.name,
            symbol: modal.data.currency.symbol,
            decimalPlacesNumber: modal.data.currency.decimal_places_number,
            type: modal.data.currency.type,
            color: modal.data.currency.color,
            isBaseCurrency: modal.data.currency.code === baseCurrencyCode,
          },
    );
  };

  return (
    <Modal
      title={modal.data?.method === 'create' ? 'Create Currency' : 'Edit Currency'}
      isOpen={modal.isOpen}
      close={modal.close}
      onOpening={onOpening}
    >
      <Modal.Content>
        <FormProvider {...methods}>
          <Form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Form.Input label="Name" name="name" />
            <Form.Input label="Symbol" name="symbol" />
            <Form.Number
              label="Number of decimal places"
              name="decimalPlacesNumber"
              decimalScale={0}
              allowNegative={false}
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
              disabled={modal.data?.currency.code === baseCurrencyCode}
            >
              Base Currency
            </Form.Checkbox>
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
