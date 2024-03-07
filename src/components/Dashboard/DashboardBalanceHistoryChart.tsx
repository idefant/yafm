import BigNumber from 'bignumber.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as TitleChart,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

import { defaultCurrencies } from '#data/defaultCurrencies';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectTransactions, selectAccountDict } from '#store/selectors';
import { TDateRates } from '#types/exratesType';
import Card from '#ui/Card';
import { TDateFilterOptions } from '#ui/DateFilter/useDateFilter';
import money from '#utils/money';

interface DashboardBalanceHistoryChartProps {
  filterData: TDateFilterOptions;
  rates?: TDateRates;
}

const DashboardBalanceHistoryChart: FC<DashboardBalanceHistoryChartProps> = ({
  filterData,
  rates,
}) => {
  const transactions = useAppSelector(selectTransactions);
  const accountDict = useAppSelector(selectAccountDict);

  const { date, periodType } = filterData;

  const startPeriodDate = date.startOf(periodType);
  const endPeriodDate = startPeriodDate.add(1, periodType);
  const daysInPeriod = endPeriodDate.diff(startPeriodDate, 'day');

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const date = dayjs(transaction.datetime);
        return date.isAfter(startPeriodDate) && date.isBefore(endPeriodDate);
      }),
    [endPeriodDate, startPeriodDate, transactions],
  );

  const daysList = useMemo(() => {
    const periodTypeAction = {
      month: () =>
        [...Array(date.daysInMonth())].map((_, i) =>
          startPeriodDate.add(i, 'day').format('DD.MM.YYYY'),
        ),
      year: () => [...Array(12)].map((_, i) => startPeriodDate.add(i, 'month').format('MM.YYYY')),
    };

    return periodTypeAction[periodType]();
  }, [periodType, date, startPeriodDate]);

  const startBalance = useMemo(
    () =>
      transactions
        .filter((transaction) => dayjs(transaction.datetime).isBefore(startPeriodDate))
        .reduce(
          (acc, transaction) => {
            transaction.operations.forEach((operation) => {
              const account = accountDict[operation.account_id];
              acc[account.currency_code] = acc[account.currency_code].plus(operation.sum);
            });
            return acc;
          },
          Object.fromEntries(defaultCurrencies.map((currency) => [currency.code, BigNumber(0)])),
        ),
    [accountDict, startPeriodDate, transactions],
  );

  const balanceChanges = useMemo(() => {
    const daysToToday = dayjs().diff(date.endOf(periodType), 'day');
    const daysCount = Math.max(0, daysInPeriod + Math.min(0, daysToToday));

    const changes = [...Array(daysCount)].map(() =>
      Object.fromEntries(defaultCurrencies.map((currency) => [currency.code, BigNumber(0)])),
    );

    filteredTransactions.forEach((transaction) => {
      transaction.operations.forEach((operation) => {
        const account = accountDict[operation.account_id];
        const change = changes[dayjs(transaction.datetime).diff(startPeriodDate, 'day')];
        change[account.currency_code] = change[account.currency_code].plus(operation.sum);
      });
    });

    return changes;
  }, [accountDict, date, daysInPeriod, filteredTransactions, periodType, startPeriodDate]);

  const currencyBalanceHistory = useMemo(() => {
    const currentBalance = { ...startBalance };

    return balanceChanges.map((change) => {
      Object.entries(change).forEach(([code, sum]) => {
        currentBalance[code] = currentBalance[code].plus(sum);
      });
      return { ...currentBalance };
    });
  }, [balanceChanges, startBalance]);

  const totalBalanceHistory = useMemo(
    () =>
      currencyBalanceHistory.map((sumGroup, i) => {
        let totalSum = money(0, 'RUB');
        Object.entries(sumGroup).forEach(([code, sum]) => {
          const dayRates = rates?.[startPeriodDate.add(i, 'day').format('YYYY-MM-DD')];
          totalSum = totalSum.add(sum, code, dayRates);
        });
        return totalSum.value;
      }),
    [rates, startPeriodDate, currencyBalanceHistory],
  );

  const groupedBalanceHistory = useMemo(() => {
    if (periodType === 'month') return totalBalanceHistory;

    const groups: BigNumber[] = [];
    for (let i = 0, j = 0; j < 12; j += 1) {
      const date = startPeriodDate.add(j, 'month');
      const monthGroup = totalBalanceHistory.slice(i, i + date.daysInMonth());
      groups.push(BigNumber.sum(...monthGroup).div(monthGroup.length));
      i += date.daysInMonth();
    }
    return groups;
  }, [periodType, startPeriodDate, totalBalanceHistory]);

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TitleChart,
    Tooltip,
    Legend,
  );

  return (
    <Card>
      <Card.Header>Capital</Card.Header>
      <Card.Body>
        <Line
          data={{
            labels: daysList,
            datasets: [
              {
                label: 'Capital',
                data: groupedBalanceHistory,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
              },
            ],
          }}
          options={{
            aspectRatio: 3,
            interaction: {
              intersect: false,
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => `Capital: ${tooltipItem.formattedValue} RUB`,
                },
              },
            },
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default DashboardBalanceHistoryChart;
