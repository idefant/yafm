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

import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTransactionsCombined, selectCurrenciesIds } from '#store/selectors';
import { components } from '#types/exrates-api-schema';
import { Card } from '#ui/Card';
import { DateFilterOptions } from '#ui/DateFilter/useDateFilter';
import { Title } from '#ui/Typography';
import { createKeysDict } from '#utils/createKeysDict';
import { groupBy } from '#utils/groupBy';
import money from '#utils/money';
import { objMap } from '#utils/objMap';

interface DashboardBalanceHistoryChartProps {
  filterData: DateFilterOptions;
  rates?: components['schemas']['DateRates'];
}

export const DashboardBalanceHistoryChart: FC<DashboardBalanceHistoryChartProps> = ({
  filterData,
  rates,
}) => {
  const transactions = useAppSelector(selectAllTransactionsCombined);
  const currenciesIds = useAppSelector(selectCurrenciesIds);
  const { baseCurrencyCode } = useAppSelector((state) => state.currencies);

  const { date, periodType } = filterData;

  const startPeriodDate = date.startOf(periodType);
  const endPeriodDate = startPeriodDate.add(1, periodType);
  const daysInPeriod = endPeriodDate.diff(startPeriodDate, 'day');

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        dayjs(transaction.datetime).isBetween(startPeriodDate, endPeriodDate, 'day', '[)'),
      ),
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
    const filteredTransactions = transactions.filter((transaction) =>
      dayjs(transaction.datetime).isBefore(startPeriodDate),
    );
    const operations = filteredTransactions.flatMap((transaction) => transaction.operations);
    const operationsGroupedByCurrencyCode = groupBy(
      operations,
      (operation) => operation.account.currency_code,
    );

    return {
      ...createKeysDict(currenciesIds, BigNumber(0)),
      ...objMap(
        operationsGroupedByCurrencyCode,
        (currencyCode, operations) => [
          currencyCode,
          BigNumber.sum(...operations.map((operation) => operation.sum)),
        ],
        { strict: true },
      ),
    };
  }, [currenciesIds, startPeriodDate, transactions]);

  const balanceChanges = useMemo(() => {
    const daysToToday = dayjs().diff(date.endOf(periodType), 'day');
    const daysCount = Math.max(0, daysInPeriod + Math.min(0, daysToToday));

    const changes = [...Array(daysCount)].map(() => createKeysDict(currenciesIds, BigNumber(0)));

    filteredTransactions.forEach((transaction) => {
      transaction.operations.forEach((operation) => {
        const currencyCode = operation.account.currency_code;
        const change = changes[dayjs(transaction.datetime).diff(startPeriodDate, 'day')];
        change[currencyCode] = change[currencyCode].plus(operation.sum);
      });
    });

    return changes;
  }, [currenciesIds, date, daysInPeriod, filteredTransactions, periodType, startPeriodDate]);

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
        let totalSum = money(0, baseCurrencyCode);
        Object.entries(sumGroup).forEach(([code, sum]) => {
          const dayRates = rates?.[startPeriodDate.add(i, 'day').format('YYYY-MM-DD')];
          totalSum = totalSum.add(sum, code, dayRates);
        });
        return totalSum.value;
      }),
    [currencyBalanceHistory, baseCurrencyCode, rates, startPeriodDate],
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
      <Card.Content>
        <Title level={4} gutterBottom>
          Capital
        </Title>
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
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `Capital: ${tooltipItem.formattedValue} ${baseCurrencyCode}`,
                },
              },
            },
          }}
        />
      </Card.Content>
    </Card>
  );
};
