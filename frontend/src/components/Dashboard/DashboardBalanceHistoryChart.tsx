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
  ChartData,
} from 'chart.js';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

import { dayjsTemplate } from '#configs/dayjs';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectAllTransactionsExtended, selectCurrenciesIds } from '#store/selectors';
import { components } from '#types/exrates-api-schema';
import { Card } from '#ui/Card';
import { Title } from '#ui/Typography';
import { average } from '#utils/average';
import { createArray } from '#utils/createArray';
import { createKeysDict } from '#utils/createKeysDict';
import { Period } from '#utils/getPeriod';
import { groupBy } from '#utils/groupBy';
import money from '#utils/money';
import { objMap } from '#utils/objMap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TitleChart,
  Tooltip,
  Legend,
);

interface DashboardBalanceHistoryChartProps {
  period: Period;
  rates?: components['schemas']['DateRates'];
}

export const DashboardBalanceHistoryChart: FC<DashboardBalanceHistoryChartProps> = ({
  period,
  rates,
}) => {
  const transactions = useAppSelector(selectAllTransactionsExtended);
  const currenciesIds = useAppSelector(selectCurrenciesIds);
  const { mainCurrencyCode } = useAppSelector((state) => state.currencies);

  /** Сумма валют на начало периода */
  const startCurrencySums = useMemo(() => {
    const operationsBeforePeriod = transactions
      .filter((transaction) => dayjs(transaction.datetime).isBefore(period.startedAt))
      .flatMap((transaction) => transaction.operations);

    const operationsGroupedByCurrency = groupBy(
      operationsBeforePeriod,
      (operation) => operation.account.currencyCode,
    );

    const currencySums = objMap(
      operationsGroupedByCurrency,
      (operations) => BigNumber.sum(...operations.map((operation) => operation.sum)),
      { strict: true },
    );

    return {
      ...createKeysDict(currenciesIds, BigNumber(0)),
      ...currencySums,
    };
  }, [currenciesIds, period.startedAt, transactions]);

  /** Изменения валют на каждый день периода */
  const currencySumsChanges = useMemo(() => {
    const transactionsIncludedInPeriod = transactions.filter((transaction) =>
      period.includes(transaction.datetime),
    );

    const transactionsGroupedByDate = groupBy(transactionsIncludedInPeriod, (transaction) =>
      dayjs(transaction.datetime).format(dayjsTemplate.date),
    );

    const currencySumsChanges = objMap(
      transactionsGroupedByDate,
      (transactions) => {
        const operationsGroupedByCurrency = groupBy(
          transactions.flatMap((transaction) => transaction.operations),
          (operation) => operation.account.currencyCode,
        );

        return objMap(
          operationsGroupedByCurrency,
          (operations) => {
            const sum = BigNumber.sum(...operations.map((operation) => operation.sum));
            return sum;
          },
          { strict: true },
        );
      },
      { strict: true },
    );
    return currencySumsChanges;
  }, [period, transactions]);

  /** История баланса на каждый день с суммой по каждой валюте и общей суммой */
  const balanceHistory = useMemo(
    () =>
      period.dateList.reduce<
        Record<string, { basicSum: BigNumber; currencySums: Record<string, BigNumber> }>
      >((acc, date, i) => {
        const dateGroupKey = date.format(dayjsTemplate.date);
        let currencySums: Record<string, BigNumber>;
        if (i === 0) {
          currencySums = { ...startCurrencySums };
        } else {
          const prevDateGroupKey = date.subtract(1, 'day').format(dayjsTemplate.date);
          currencySums = { ...acc[prevDateGroupKey]?.currencySums };
        }

        Object.entries(currencySumsChanges[dateGroupKey] || {}).forEach(
          ([currencyCode, change]) => {
            currencySums[currencyCode] = currencySums[currencyCode].plus(change);
          },
        );

        const basicSum = money.sum(
          Object.entries(currencySums).map(([mainCurrencyCode, sum]) => ({
            value: sum,
            currency: mainCurrencyCode,
            rates: rates?.[dateGroupKey],
          })),
          mainCurrencyCode,
        ).value;

        acc[dateGroupKey] = { currencySums, basicSum };
        return acc;
      }, {}),
    [currencySumsChanges, mainCurrencyCode, period.dateList, rates, startCurrencySums],
  );

  /** Данные для графика */
  const dataLine = useMemo(() => {
    const labels = (() => {
      if (period.unit === 'month') {
        return createArray(period.daysCount, (i) =>
          period.startedAt.add(i, 'day').format('DD.MM.YYYY'),
        );
      }
      if (period.unit === 'year') {
        return createArray(12, (i) => period.startedAt.add(i, 'month').format('MM.YYYY'));
      }
      return [];
    })();

    const dataList = (() => {
      if (period.unit === 'month') {
        return period.dateList.map((date) => {
          const dateGroupKey = date.format(dayjsTemplate.date);
          if (!rates || !(dateGroupKey in rates)) return null;
          return balanceHistory[dateGroupKey].basicSum;
        });
      }
      if (period.unit === 'year') {
        return period.monthList.map((month) => {
          const daysInMonth = Object.entries(balanceHistory)
            .map(([date, { currencySums, basicSum }]) => ({ date, currencySums, basicSum }))
            .filter(({ date }) => month.isSame(date, 'month'));

          const daysInMonthWithRate = daysInMonth.filter((data) => rates && data.date in rates);
          return average(...daysInMonthWithRate.map((data) => data.basicSum));
        });
      }
      return [];
    })();

    const data: ChartData<'line', (BigNumber | null)[]> = {
      labels,
      datasets: [
        {
          label: 'Capital',
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          cubicInterpolationMode: 'monotone',
          tension: 0.4,
          data: dataList,
        },
      ],
    };
    return data;
  }, [
    period.unit,
    period.daysCount,
    period.startedAt,
    period.dateList,
    period.monthList,
    rates,
    balanceHistory,
  ]);

  return (
    <Card>
      <Card.Content>
        <Title level={4} gutterBottom>
          Capital
        </Title>
        <Line
          data={dataLine}
          options={{
            aspectRatio: 3,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (tooltipItem) =>
                    `Capital: ${tooltipItem.formattedValue} ${mainCurrencyCode}`,
                },
              },
            },
          }}
        />
      </Card.Content>
    </Card>
  );
};
