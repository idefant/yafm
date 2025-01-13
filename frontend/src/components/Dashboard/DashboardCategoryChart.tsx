import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import { FC, useCallback } from 'react';
import { Pie } from 'react-chartjs-2';

import colors from '#data/color';
import { useAppSelector } from '#hooks/reduxHooks';
import {
  selectAllTransactionCategoriesEntities,
  selectAllTransactionsCombined,
} from '#store/selectors';
import { components } from '#types/exrates-api-schema';
import { TransactionType } from '#types/transactionType';
import Card from '#ui/Card';
import { DateFilterOptions } from '#ui/DateFilter/useDateFilter';
import { groupBy } from '#utils/groupBy';
import money from '#utils/money';
import { getTransactionsGroupedByType } from '#utils/transaction';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardCategoryChartProps {
  filterData: DateFilterOptions;
  rates?: components['schemas']['DateRates'];
}

const DashboardCategoryChart: FC<DashboardCategoryChartProps> = ({ filterData, rates }) => {
  const transactions = useAppSelector(selectAllTransactionsCombined);
  const categoriesEntities = useAppSelector(selectAllTransactionCategoriesEntities);
  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);

  const { date, periodType } = filterData;

  const startPeriodDate = date.startOf(periodType);
  const endPeriodDate = startPeriodDate.add(1, periodType);

  const filteredTransactions = transactions.filter((transaction) =>
    dayjs(transaction.datetime).isBetween(startPeriodDate, endPeriodDate, 'day', '[)'),
  );

  const transactionsGroupedByType = getTransactionsGroupedByType(filteredTransactions);

  const getChartData = useCallback(
    (transactionType: TransactionType) => {
      const categorySums = Object.entries(
        groupBy(transactionsGroupedByType[transactionType], 'category_id'),
      )
        .map(([categoryId, transactions]) => {
          const sum = transactions
            .reduce(
              (acc, transaction) => {
                const dayRates = rates?.[dayjs(transaction.datetime).format('YYYY-MM-DD')];
                transaction.operations.forEach((operation) => {
                  acc.add(operation.sum, operation.account.currency_code, dayRates);
                });
                return acc;
              },
              money(0, baseCurrencyCode),
            )
            .value.abs();

          return { id: categoryId, sum };
        })
        .sort((a, b) => b.sum.minus(a.sum).toNumber());

      return {
        dataset: categorySums.map(({ sum }) => sum),
        labels: categorySums.map(({ id }) => categoriesEntities[id]?.name || ''),
      };
    },
    [baseCurrencyCode, categoriesEntities, rates, transactionsGroupedByType],
  );

  const incomesChartData = getChartData('income');
  const outcomesChartData = getChartData('outcome');

  return (
    <div className="grid grid-cols-2 gap-4 items-start">
      <Card>
        <Card.Header>Income per category</Card.Header>
        <Card.Body className="max-w-[350px] mx-auto">
          <Pie
            data={{
              datasets: [
                {
                  data: incomesChartData.dataset,
                  backgroundColor: colors,
                },
              ],
              labels: incomesChartData.labels,
            }}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) =>
                      `${tooltipItem.label}: ${tooltipItem.formattedValue} ${baseCurrencyCode}`,
                  },
                },
              },
            }}
          />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Expense per category</Card.Header>
        <Card.Body className="max-w-[350px] mx-auto">
          <Pie
            data={{
              datasets: [
                {
                  data: outcomesChartData.dataset,
                  backgroundColor: colors,
                },
              ],
              labels: outcomesChartData.labels,
            }}
            options={{
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) =>
                      `${tooltipItem.label}: ${tooltipItem.formattedValue} ${baseCurrencyCode}`,
                  },
                },
              },
            }}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default DashboardCategoryChart;
