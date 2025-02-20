import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import BigNumber from 'bignumber.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { SetRequired } from 'type-fest';
import { useBoolean } from 'usehooks-ts';

import { dayjsTemplate } from '#configs/dayjs';
import colors from '#data/color';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTransactionsExtended, selectCurrencyById } from '#store/selectors';
import { Category } from '#types/categoryType';
import { components } from '#types/exrates-api-schema';
import { TransactionExtended, TransactionType } from '#types/transactionType';
import { Button } from '#ui/Button';
import { Card } from '#ui/Card';
import { HStack, VStack } from '#ui/Stack';
import { SumValue } from '#ui/SumValue';
import { Table } from '#ui/Table';
import { Title, Text } from '#ui/Typography';
import { getPercentage } from '#utils/getPercentage';
import { Period } from '#utils/getPeriod';
import { groupBy } from '#utils/groupBy';
import money from '#utils/money';
import { getTransactionsGroupedByType } from '#utils/transaction';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardCategoryChartProps {
  period: Period;
  rates?: components['schemas']['DateRates'];
  transactionType: TransactionType;
}

const columnHelper = createColumnHelper<
  SetRequired<Partial<Category>, 'id'> & {
    transactions: TransactionExtended[];
    baseSum: BigNumber;
  }
>();

export const DashboardCategoryChart: FC<DashboardCategoryChartProps> = ({
  period,
  rates,
  transactionType,
}) => {
  const transactions = useAppSelector(selectAllTransactionsExtended);
  const { mainCurrencyCode } = useAppSelector((state) => state.currencies);
  const mainCurrency = useAppSelector((state) => selectCurrencyById(state, mainCurrencyCode));

  const isTableShown = useBoolean();

  const filteredTransactions = useMemo(
    () => transactions.filter((transaction) => period.includes(transaction.datetime)),
    [period, transactions],
  );

  const transactionsGroupedByType = useMemo(
    () => getTransactionsGroupedByType(filteredTransactions),
    [filteredTransactions],
  );

  const categoriesWithSum = useMemo(
    () =>
      Object.entries(
        groupBy(
          transactionsGroupedByType[transactionType],
          (transaction) => transaction.categoryId,
        ),
      )
        .map(([categoryId, transactions]) => {
          const baseSum = money.sum(
            transactions.flatMap((transaction) =>
              transaction.operations.map((operation) => ({
                value: operation.sum,
                currencyCode: operation.account.currencyCode,
                rates: rates?.[dayjs(transaction.datetime).format(dayjsTemplate.date)],
              })),
            ),
            mainCurrencyCode,
          ).value;

          return {
            ...transactions[0].category,
            id: categoryId,
            transactions,
            baseSum,
          };
        })
        .sort((a, b) => b.baseSum.abs().minus(a.baseSum.abs()).toNumber()),
    [mainCurrencyCode, rates, transactionType, transactionsGroupedByType],
  );

  const totalSum = useMemo(
    () => money.sum(categoriesWithSum.map((category) => ({ value: category.baseSum }))).value,
    [categoriesWithSum],
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        size: Number.MAX_SAFE_INTEGER,
        cell: (info) => info.getValue() || '-',
      }),
      columnHelper.accessor('baseSum', {
        header: 'Sum',
        size: 0,
        // eslint-disable-next-line react/no-unstable-nested-components
        cell: (info) => (
          <SumValue
            value={info.getValue()}
            decimalPlaces={mainCurrency?.decimalPlaces}
            currencyCode={mainCurrencyCode}
            size="sm"
          />
        ),
        meta: {
          justify: 'end',
        },
      }),
    ],
    [mainCurrency?.decimalPlaces, mainCurrencyCode],
  );

  const table = useReactTable({
    groupedColumnMode: 'remove',
    data: categoriesWithSum,
    columns,
    getRowId: (original) => original.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const chartData = useMemo(
    () => ({
      dataset: categoriesWithSum.map((category) => category.baseSum),
      labels: categoriesWithSum.map((category) => category?.name),
    }),
    [categoriesWithSum],
  );

  return (
    <Card>
      <Card.Content>
        <Title level={5} gutterBottom>
          {transactionType === 'income' ? 'Income' : 'Expense'} per category
        </Title>
        <VStack gap={16}>
          <HStack>
            <Text size="lg">Сумма:</Text>
            <SumValue
              value={totalSum}
              currencyCode={mainCurrencyCode}
              decimalPlaces={mainCurrency?.decimalPlaces}
              size="lg"
            />
          </HStack>

          <Pie
            data={{
              datasets: [
                {
                  data: chartData.dataset,
                  backgroundColor: colors,
                },
              ],
              labels: chartData.labels,
            }}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const { parsed, formattedValue, label } = tooltipItem;
                      const percentage = getPercentage(parsed, totalSum, { decimalPlaces: 1 });
                      return `${label}: ${formattedValue} ${mainCurrencyCode} - ${percentage}`;
                    },
                  },
                },
              },
            }}
          />

          <Button variant="outlined" onClick={isTableShown.toggle}>
            {isTableShown.value ? 'Скрыть таблицу' : 'Показать таблицу'}
          </Button>

          {isTableShown.value && <Table table={table} fullWidth size="sm" headTextSize="md" />}
        </VStack>
      </Card.Content>
    </Card>
  );
};
