import { FC, useState } from 'react';
import Swal from 'sweetalert2';

import { useFetchCurrenciesQuery } from '#api/exratesApi';
import { OpenedCurrency, SetCurrency } from '#components/Currency';
import { HeaderInfo } from '#components/Header';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllAccounts, selectCurrencies, selectCurrenciesIds } from '#store/selectors';
import PencilIcon from '#svg/pencil.svg?react';
import PlusIcon from '#svg/plus.svg?react';
import StarIcon from '#svg/star.svg?react';
import TrashIcon from '#svg/trash.svg?react';
import { Currency } from '#types/currencyType';
import { Card } from '#ui/Card';
import { Grid } from '#ui/Grid';
import { useModal } from '#ui/Modal';
import Table, { Column, TableAction } from '#ui/Table';
import { Title } from '#ui/Typography';
import { actionCreator, committer } from '#utils/committer';

const Currencies: FC = () => {
  const currencies = useAppSelector(selectCurrencies);
  const currenciesIds = useAppSelector(selectCurrenciesIds);
  const accounts = useAppSelector(selectAllAccounts);
  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);

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

  const confirmDelete = (currency: Currency) => {
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
      }).then(async (result) => {
        if (result.isConfirmed) {
          committer(actionCreator.deleteCurrency(currency.code)).sync();
        }
      });
    }
  };

  const currenciesTableColumns: Column<Currency>[] = [
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
          {record.code === baseCurrencyCode && <TableAction icon={StarIcon} />}
          <TableAction
            onClick={() => openCurrency({ method: 'update', currency: record })}
            icon={PencilIcon}
          />
          <TableAction onClick={() => confirmDelete(record)} icon={TrashIcon} />
        </div>
      ),
    },
  ];

  const unusedCurrenciesTableColumns: Column<{ name: string; code: string }>[] = [
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
            icon={PlusIcon}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <HeaderInfo title="Currencies" />

      <Grid gap={16}>
        <Grid.Item size={6}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                Added Currencies
              </Title>
              <Table
                columns={currenciesTableColumns}
                data={currencies}
                getKey={(record) => record.code}
                className={{ table: 'w-full' }}
              />
            </Card.Content>
          </Card>
        </Grid.Item>

        <Grid.Item size={6}>
          <Card>
            <Card.Content>
              <Title level={4} gutterBottom>
                Unused Currencies
              </Title>
              <Table
                columns={unusedCurrenciesTableColumns}
                data={unusedCurrencies}
                getKey={(record) => record.code}
                className={{ table: 'w-full' }}
              />
            </Card.Content>
          </Card>
        </Grid.Item>
      </Grid>

      <SetCurrency
        isOpen={currencyModal.isOpen}
        close={currencyModal.close}
        data={openedCurrency}
      />
    </>
  );
};

export default Currencies;
