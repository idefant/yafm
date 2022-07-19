import axios from 'axios';
import Swal from 'sweetalert2';

import { TCipher } from '../../types/cipher';

import { getErrorMessage } from '.';

export const setBaseRequest = (data: TCipher, baseURL: string) => axios({
  method: 'POST',
  baseURL,
  url: '/base',
  data,
}).catch((error) => {
  Swal.fire({ title: getErrorMessage(error), icon: 'error' });
});

export const getBaseRequest = (baseURL: string) => axios({
  method: 'GET',
  baseURL,
  url: '/base',
}).catch((error) => {
  Swal.fire({ title: getErrorMessage(error), icon: 'error' });
});

export const getVersionListRequest = (baseURL: string) => axios({
  method: 'GET',
  baseURL,
  url: '/base/versions',
}).catch((error) => {
  Swal.fire({ title: getErrorMessage(error), icon: 'error' });
});

export const getVersionByFilenameRequest = (
  filename: string,
  baseURL: string,
) => axios({
  method: 'GET',
  baseURL,
  url: `/base/versions/${filename}`,
}).catch((error) => {
  Swal.fire({ title: getErrorMessage(error), icon: 'error' });
});
