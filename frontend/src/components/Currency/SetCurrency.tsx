import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAppSelector } from '#hooks/reduxHooks';
import { currencyTypes } from '#schema/currencySchema';
import { Currency } from '#types/currencyType';
import { Button } from '#ui/Button';
import { Form } from '#ui/Form';
import { Modal, UseModalReturn } from '#ui/Modal';
import { capitalize } from '#utils/capitalize';
import { actionCreator, committer } from '#utils/committer';

export type SetCurrencyModalData =
  | { method: 'create'; currency: { name: string; code: string } }
  | { method: 'edit'; currency: Currency };

interface SetCurrencyProps {
  modal: UseModalReturn<SetCurrencyModalData>;
}

const formSchema = z.object({
  name: z.string().trim().nonempty(),
  decimalPlaces: z.coerce.number().nonnegative().int(),
  type: z.enum(currencyTypes),
  color: z.string().nullish(),
  symbol: z.string().trim().nonempty(),
  isMainCurrency: z.boolean(),
});

type FormOutput = z.infer<typeof formSchema>;

export const SetCurrency: FC<SetCurrencyProps> = ({ modal }) => {
  const formId = useId();

  const { mainCurrencyCode } = useAppSelector((state) => state.currencies);

  const methods = useForm<FormOutput>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (values: FormOutput) => {
    if (!modal.isOpen) return;

    const currencyData = {
      name: values.name,
      decimalPlaces: values.decimalPlaces,
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

    if (values.isMainCurrency) {
      commit.add(actionCreator.setMainCurrency(modal.data.currency.code));
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
            decimalPlaces: 2,
            type: 'fiat',
            color: '',
            isMainCurrency: false,
          }
        : {
            name: modal.data.currency.name,
            symbol: modal.data.currency.symbol,
            decimalPlaces: modal.data.currency.decimalPlaces,
            type: modal.data.currency.type,
            color: modal.data.currency.color,
            isMainCurrency: modal.data.currency.code === mainCurrencyCode,
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
              name="decimalPlaces"
              decimalScale={0}
              allowNegative={false}
            />

            <Form.Select
              label="Currency type"
              placeholder="Choose currency type..."
              options={currencyTypes.map((currencyType) => ({
                value: currencyType,
                label: capitalize(currencyType),
              }))}
              name="type"
            />

            <Form.Input label="Color" name="color" />

            <Form.Checkbox
              name="isMainCurrency"
              disabled={modal.data?.currency.code === mainCurrencyCode}
            >
              Main Currency
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
