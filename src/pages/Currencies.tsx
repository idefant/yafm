import { FC, useState } from 'react';
import Swal from 'sweetalert2';

import { useFetchCurrenciesQuery } from '#api/exratesApi';
import { OpenedCurrency, SetCurrency } from '#components/Currency';
import { useAppDispatch, useAppSelector } from '#hooks/reduxHooks';
import useModal from '#hooks/useModal';
import { setIsUnsaved } from '#store/reducers/appSlice';
import { currencyDeleted } from '#store/reducers/currenciesSlice';
import { selectAllAccounts, selectCurrencies, selectCurrenciesIds } from '#store/selectors';
import { TCurrency } from '#types/currencyType';
import Card from '#ui/Card';
import Icon from '#ui/Icon';
import Table, { TColumn, TableAction } from '#ui/Table';
import { Title } from '#ui/Title';

const Currencies: FC = () => {
  const currencies = useAppSelector(selectCurrencies);
  const currenciesIds = useAppSelector(selectCurrenciesIds);
  const accounts = useAppSelector(selectAllAccounts);
  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);
  const dispatch = useAppDispatch();

  const { data: availableCurrencies } = useFetchCurrenciesQuery();

  const currencyModal = useModal();

  const [openedCurrency, setOpenedCurrency] = useState<OpenedCurrency>();

  const openCurrency = (currency?: OpenedCurrency) => {
    setOpenedCurrency(currency);
    currencyModal.open();
  };

  const unusedCurrencies = Object.entries(availableCurrencies || {})
    .filter(([code]) => !currenciesIds.includes(code))
    .map(([code, name]) => ({ code, name }));

  const confirmDelete = (currency: TCurrency) => {
    if (accounts.some(({ currency_code: currencyCode }) => currencyCode === currency.code)) {
      Swal.fire({
        title: 'Unable to delete currency',
        text: 'There are accounts using this currency',
        icon: 'error',
      });
    } else if (currency.code === baseCurrencyCode) {
      Swal.fire({
        title: 'Unable to delete currency',
        text: 'This is base currency',
        icon: 'error',
      });
    } else {
      Swal.fire({
        title: 'Delete currency',
        icon: 'error',
        text: `Name: ${currency.name}`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Delete',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(currencyDeleted(currency.code));
          dispatch(setIsUnsaved(true));
        }
      });
    }
  };

  const currenciesTableColumns: TColumn<TCurrency>[] = [
    {
      key: 'name',
      title: 'Name',
    },
    {
      key: 'code',
      title: 'Code',
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      width: 'min',
      render: ({ record }) => (
        <div className="flex ml-6 justify-end">
          {record.code === baseCurrencyCode && <TableAction icon={Icon.Star} />}
          <TableAction
            onClick={() => openCurrency({ method: 'update', currency: record })}
            icon={Icon.Pencil}
          />
          <TableAction onClick={() => confirmDelete(record)} icon={Icon.Trash} />
        </div>
      ),
    },
  ];

  const unusedCurrenciesTableColumns: TColumn<{ name: string; code: string }>[] = [
    {
      key: 'name',
      title: 'Name',
    },
    {
      key: 'code',
      title: 'Code',
    },
    {
      key: 'actions',
      cellClassName: '!p-0',
      width: 'min',
      render: ({ record }) => (
        <div className="flex ml-6">
          <TableAction
            onClick={() => openCurrency({ method: 'create', currency: record })}
            icon={Icon.Plus}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <Title>Currencies</Title>

      <div className="grid grid-cols-2 gap-4 items-start">
        <Card>
          <Card.Header>Added Currencies</Card.Header>
          <Card.Body>
            <Table
              columns={currenciesTableColumns}
              data={currencies}
              getKey={(record) => record.code}
              className={{ table: 'w-full' }}
            />
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>Unused Currencies</Card.Header>
          <Card.Body>
            <Table
              columns={unusedCurrenciesTableColumns}
              data={unusedCurrencies}
              getKey={(record) => record.code}
              className={{ table: 'w-full' }}
            />
          </Card.Body>
        </Card>
      </div>

      <SetCurrency
        isOpen={currencyModal.isOpen}
        close={currencyModal.close}
        data={openedCurrency}
      />
    </>
  );
};

export default Currencies;
