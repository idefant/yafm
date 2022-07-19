import { FC } from 'react';

import { convertPrice, numToString } from '../../helper/currencies';
import { useAppSelector } from '../../hooks/reduxHooks';
import { Title } from '../Generic/Title';

const Main: FC = () => {
  const { fng, prices, currencies } = useAppSelector((state) => state.currency);
  const baseCurrencyCode = 'rub';

  const data = currencies
    .filter((currency) => currency.code.toLowerCase() !== baseCurrencyCode)
    .map((currency) => ({
      code: currency.code,
      price: numToString(
        convertPrice(currency.code.toLowerCase(), baseCurrencyCode, 1)
          * 10 ** (currency.decimal_places_number - 2),
        currency.decimal_places_number,
      ),
    }));

  return (
    <>
      <Title>Main</Title>
      <div className="flex gap-4 ">
        {fng && (
          <div className="border-4 border-gray-700 p-4">
            <h2 className="text-xl font-bold mb-3">Fear & Greed Index</h2>
            <a
              href="https://alternative.me/crypto/fear-and-greed-index/"
              target="_blank"
              rel="noreferrer"
            >
              <div className="bg-red-500 p-3 text-lg rounded-full text-center">
                {fng.text}
                {' '}
                -
                <span className="font-bold">{fng.value}</span>
              </div>
            </a>
          </div>
        )}

        {prices && (
          <div className="border-4 border-gray-700 p-4">
            <h2 className="text-xl font-bold mb-3">Exchange Rates</h2>
            {data.map((currency) => (
              <div className="flex justify-between gap-4" key={currency.code}>
                <div className="font-bold">
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
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
