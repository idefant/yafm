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

import { defaultCurrencies } from '../../data/defaultCurrencies';
import { useAppSelector } from '../../hooks/reduxHooks';
import { selectAccountDict, selectCurrencyDict, selectTransactions } from '../../store/selectors';
import Card from '../../UI/Card';
import { TDateFilterOptions } from '../../UI/DateFilter/useDateFilter';
import { getHistoryBalancesByChanges, withDigits } from '../../utils/currencies';
import { average } from '../../utils/math';
import { TDateRates } from '../../utils/requests/exratesRequests';

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
  const currencyDict = useAppSelector(selectCurrencyDict);

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

  const startBalance = useMemo(() => {
    const transactionsBefore = transactions
      .filter((transaction) => dayjs(transaction.datetime).isBefore(startPeriodDate))
      .reduce((acc: Record<string, number>, transaction) => {
        transaction.operations.forEach((operation) => {
          const account = accountDict[operation.account_id];
          // eslint-disable-next-line no-param-reassign
          acc[account.currency_code] += operation.sum;
        });
        return acc;
      }, Object.fromEntries(defaultCurrencies.map((currency) => [currency.code, 0])));

    return Object.fromEntries(
      Object.entries(transactionsBefore).map(([code, sum]) => {
        const currency = currencyDict[code];
        return [code, withDigits(sum, currency.decimal_places_number)];
      }),
    );
  }, [accountDict, currencyDict, startPeriodDate, transactions]);

  const balanceChanges = useMemo(() => {
    const daysToToday = dayjs().diff(date.endOf(periodType), 'day');
    const daysCount = Math.max(0, daysInPeriod + Math.min(0, daysToToday));

    const changes: Record<string, number>[] = [...Array(daysCount)].map(() =>
      Object.fromEntries(defaultCurrencies.map((currency) => [currency.code, 0])),
    );

    filteredTransactions.forEach((transaction) => {
      transaction.operations.forEach((operation) => {
        const account = accountDict[operation.account_id];
        const currency = currencyDict[account.currency_code];
        const change = changes[dayjs(transaction.datetime).diff(startPeriodDate, 'day')];
        change[account.currency_code] += withDigits(operation.sum, currency.decimal_places_number);
      });
    });

    return changes;
  }, [
    accountDict,
    currencyDict,
    date,
    daysInPeriod,
    filteredTransactions,
    periodType,
    startPeriodDate,
  ]);

  const currencyBalanceHistory = useMemo(
    () => getHistoryBalancesByChanges(startBalance, balanceChanges),
    [balanceChanges, startBalance],
  );

  const totalBalanceHistory = useMemo(
    () =>
      currencyBalanceHistory.map((sumGroup, i) => {
        if (!rates) return 0;

        let totalSum = 0;
        Object.entries(sumGroup).forEach(([code, sum]) => {
          const dayRates = rates[startPeriodDate.add(i, 'day').format('YYYY-MM-DD')];
          if (dayRates) {
            totalSum += (sum * dayRates.RUB) / dayRates[code];
          }
        });
        return totalSum;
      }),
    [rates, startPeriodDate, currencyBalanceHistory],
  );

  const groupedBalanceHistory = useMemo(() => {
    if (periodType === 'month') return totalBalanceHistory;

    const groups: number[] = [];
    for (let i = 0, j = 0; j < 12; j += 1) {
      const date = startPeriodDate.add(j, 'month');
      groups.push(average(totalBalanceHistory.slice(i, i + date.daysInMonth())));
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
