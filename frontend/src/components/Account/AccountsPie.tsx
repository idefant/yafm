import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { FC, useMemo } from 'react';
import { Pie } from 'react-chartjs-2';

import { useFetchLastRatesQuery } from '#api/exratesApi';
import { useAppSelector } from '#hooks/reduxHooks';
import { selectCurrencies, selectCurrenciesBalanceDict } from '#store/selectors';
import { getEntities } from '#utils/getEntities';
import { getPercentage } from '#utils/getPercentage';
import money from '#utils/money';
import { sum } from '#utils/sum';

ChartJS.register(ArcElement, Tooltip, Legend);

export const AccountsPie: FC = () => {
  const currencies = useAppSelector(selectCurrencies);
  const currenciesBalanceDict = useAppSelector(selectCurrenciesBalanceDict);
  const { mainCurrencyCode } = useAppSelector((state) => state.currencies);

  const { data: prices } = useFetchLastRatesQuery({});

  const currenciesWithBalance = useMemo(
    () =>
      currencies
        .filter((currency) => currency.code in currenciesBalanceDict)
        .map((currency) => ({
          ...currency,
          balance: currenciesBalanceDict[currency.code]!,
          baseBalance: money(
            currenciesBalanceDict[currency.code]!,
            currency.code,
            prices?.rates,
          ).to(mainCurrencyCode).value,
        }))
        .filter((currency) => !currency.baseBalance.isZero()),
    [mainCurrencyCode, currencies, currenciesBalanceDict, prices?.rates],
  );

  const currencyBalancesDict = getEntities(currenciesWithBalance, (currency) => currency.code);
  const totalAmount = sum(currenciesWithBalance, (currency) => currency.baseBalance);

  const data: ChartData<'pie', any, string> = useMemo(
    () => ({
      labels: currenciesWithBalance.map((currency) => currency.code),
      datasets: [
        {
          data: currenciesWithBalance.map((currency) => currency.baseBalance),
          backgroundColor: currenciesWithBalance.map((currency) => currency.color),
        },
      ],
    }),
    [currenciesWithBalance],
  );

  if (!currenciesWithBalance.length) return null;

  return (
    <Pie
      data={data}
      options={{
        plugins: {
          legend: {
            labels: {
              color: '#fff',
            },
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const { balance, baseBalance } = currencyBalancesDict[tooltipItem.label]!;
                const percentage = getPercentage(baseBalance, totalAmount, { decimalPlaces: 1 });
                const formattedBalance = money(balance).format();
                return `${tooltipItem.label}: ${formattedBalance} - ${percentage}`;
              },
            },
          },
        },
      }}
    />
  );
};
