import axios from "axios";
import { getErrorMessage } from ".";
import { TApi } from "../../types/userType";
import { refreshToken } from "../jwt";
import { errorAlert } from "../sweetalert";

export const createCommitRequest = (
  iv: string,
  hmac: string,
  cipher: string,
  accessToken: string,
  api: TApi
) => {
  refreshToken(api, accessToken);
  return axios({
    method: "POST",
    baseURL: api.url,
    url: "/commit",
    data: { iv, hmac, cipher },
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const getLastCommitRequest = (accessToken: string, api: TApi) => {
  refreshToken(api, accessToken);
  return axios({
    method: "GET",
    baseURL: api.url,
    url: "/commits/last",
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};
