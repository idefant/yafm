import { createAsyncThunk } from '@reduxjs/toolkit';

import { getFnGIndexRequest, getPricesRequest } from '../../utils/requests/currencyApiRequest';

export const fetchPrices = createAsyncThunk('currency/fetchPrices', async () => {
  const response = await getPricesRequest();
  return response.data.bitcoin;
});

export const fetchFnG = createAsyncThunk('currency/fetchFnG', async () => {
  const response = await getFnGIndexRequest();
  const data = response.data.data[0];
  return {
    value: data.value,
    text: data.value_classification,
  };
});
