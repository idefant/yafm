import { FC } from 'react';

import { useFetchLastRatesQuery, useFetchRatesByPeriodQuery } from '../api/exratesApi';
import { DashboardBalanceHistoryChart, DashboardCategoryChart } from '../components/Dashboard';
import { useAppSelector } from '../hooks/reduxHooks';
import Card from '../UI/Card';
import DateFilter, { useDateFilter } from '../UI/DateFilter';
import { Title } from '../UI/Title';
import { convertPrice, formatPrice } from '../utils/currencies';

const dateQuery = {
  month: 'YYYY-MM',
  year: 'YYYY',
};

const Dashboard: FC = () => {
  const { currencies } = useAppSelector((state) => state.currency);
  const { data: prices } = useFetchLastRatesQuery();
  const baseCurrencyCode = 'rub';

  const filterData = useDateFilter();
  const { date, periodType } = filterData;
  const { data: rates } = useFetchRatesByPeriodQuery(date.format(dateQuery[periodType]));

  const data = currencies
    .filter((currency) => currency.code.toLowerCase() !== baseCurrencyCode)
    .map((currency) => ({
      code: currency.code,
      price: formatPrice(
        convertPrice(currency.code.toLowerCase(), baseCurrencyCode, 1, prices?.rates || {}, {
          useAtomicUnit: false,
        }),
        currency.decimal_places_number,
        { useAtomicUnit: false },
      ),
    }));

  return (
    <>
      <Title>Dashboard</Title>
      <div className="flex gap-4 items-start">
        {/* {fng && (
          <Card>
            <Card.Header>Fear &#38; Greed Index</Card.Header>
            <Card.Body className="flex gap-6 font-bold text-xl items-center justify-center my-2">
              <div>{fng.text}</div>
              <div className="text-3xl">{fng.value}</div>
            </Card.Body>
            <Card.Footer className="!p-0">
              <a
                href="https://alternative.me/crypto/fear-and-greed-index/"
                target="_blank"
                rel="noreferrer"
                className="block text-center px-5 py-1.5"
              >
                Show Source
              </a>
            </Card.Footer>
          </Card>
        )}

        {prices && (
          <Card>
            <Card.Header>Exchange Rates</Card.Header>
            <Card.Body className="text-lg">
              {data.map((currency) => (
                <div className="flex justify-between gap-6" key={currency.code}>
                  <div>{currency.code}:</div>
                  <div>
                    {currency.price} {baseCurrencyCode.toUpperCase()}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        )} */}
      </div>

      <Card>
        <Card.Header>Data Filter</Card.Header>
        <Card.Body>
          <DateFilter options={filterData} />
        </Card.Body>
      </Card>

      <DashboardBalanceHistoryChart filterData={filterData} rates={rates} />

      <DashboardCategoryChart filterData={filterData} rates={rates} />
    </>
  );
};

export default Dashboard;
