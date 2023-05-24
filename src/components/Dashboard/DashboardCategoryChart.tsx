import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';

import colors from '../../data/color';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectTransactionCategoryDict, selectTransactions } from '../../store/selectors';
import { TDateRates } from '../../types/exratesType';
import Card from '../../UI/Card';
import { TDateFilterOptions } from '../../UI/DateFilter/useDateFilter';
import group from '../../utils/group';
import { getTransactionsGroupedByType, getTransactionsSum } from '../../utils/transaction';

interface DashboardCategoryChartProps {
  filterData: TDateFilterOptions;
  rates?: TDateRates;
}

const DashboardCategoryChart: FC<DashboardCategoryChartProps> = ({ filterData, rates }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);

  const transactions = useAppSelector(selectTransactions);
  const categoryDict = useAppSelector(selectTransactionCategoryDict);

  const { date, periodType } = filterData;

  const startPeriodDate = date.startOf(periodType);
  const endPeriodDate = startPeriodDate.add(1, periodType);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const date = dayjs(transaction.datetime);
        return date.isAfter(startPeriodDate) && date.isBefore(endPeriodDate);
      }),
    [endPeriodDate, startPeriodDate, transactions],
  );

  const transactionsGroupedByType = getTransactionsGroupedByType(filteredTransactions);

  const incomesChartData = useMemo(() => {
    const categorySums = Object.entries(group(transactionsGroupedByType.income, 'category_id'))
      .map(([categoryId, transactions]) => ({
        id: categoryId,
        sum: getTransactionsSum(transactions, rates),
      }))
      .sort((a, b) => b.sum - a.sum);

    return {
      dataset: categorySums.map(({ sum }) => sum),
      labels: categorySums.map(({ id }) => categoryDict[id]?.name || ''),
    };
  }, [categoryDict, rates, transactionsGroupedByType.income]);

  const outcomesChartData = useMemo(() => {
    const categorySums = Object.entries(group(transactionsGroupedByType.outcome, 'category_id'))
      .map(([categoryId, transactions]) => ({
        id: categoryId,
        sum: -getTransactionsSum(transactions, rates),
      }))
      .sort((a, b) => b.sum - a.sum);

    return {
      dataset: categorySums.map(({ sum }) => sum),
      labels: categorySums.map(({ id }) => categoryDict[id]?.name || ''),
    };
  }, [categoryDict, rates, transactionsGroupedByType.outcome]);

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
                      `${tooltipItem.label}: ${tooltipItem.formattedValue} RUB`,
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
                      `${tooltipItem.label}: ${tooltipItem.formattedValue} RUB`,
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
