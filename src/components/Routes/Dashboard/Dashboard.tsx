import { FC } from 'react';

import { convertPrice, formatPrice } from '../../../helper/currencies';
import { useAppSelector } from '../../../hooks/reduxHooks';
import Card from '../../Generic/Card';
import DateFilter, { useDateFilter } from '../../Generic/DateFilter';
import { Title } from '../../Generic/Title';

import DashboardBalanceHistoryChart from './DashboardBalanceHistoryChart';

const Dashboard: FC = () => {
  const { fng, prices, currencies } = useAppSelector((state) => state.currency);
  const baseCurrencyCode = 'rub';

  const filterData = useDateFilter();

  const data = currencies
    .filter((currency) => currency.code.toLowerCase() !== baseCurrencyCode)
    .map((currency) => ({
      code: currency.code,
      price: formatPrice(
        convertPrice(currency.code.toLowerCase(), baseCurrencyCode, 1, { useAtomicUnit: false }),
        currency.decimal_places_number,
        { useAtomicUnit: false },
      ),
    }));

  return (
    <>
      <Title>Dashboard</Title>
      <div className="flex gap-4 items-start">
        {fng && (
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
                  <div>
                    {currency.code}
                    :
                  </div>
                  <div>
                    {currency.price}
                    {' '}
                    {baseCurrencyCode.toUpperCase()}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        )}
      </div>

      <Card>
        <Card.Header>Data Filter</Card.Header>
        <Card.Body>
          <DateFilter options={filterData} />
        </Card.Body>
      </Card>

      <DashboardBalanceHistoryChart filterData={filterData} />
    </>
  );
};

export default Dashboard;
