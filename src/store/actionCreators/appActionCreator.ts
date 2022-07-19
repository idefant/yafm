import { createAsyncThunk } from '@reduxjs/toolkit';

import { getInfoRequest } from '../../helper/requests/infoRequest';

export const fetchVaultInfo = createAsyncThunk(
  'app/fetchVaultInfo',
  async (vaultUrl: string, { rejectWithValue }) => {
    const response = await getInfoRequest(vaultUrl);

    if (response.data.name !== 'yafm-vault') {
      return rejectWithValue('Wrong Url. This is not vault');
    }
    return response.data.use_versioning;
  },
);
