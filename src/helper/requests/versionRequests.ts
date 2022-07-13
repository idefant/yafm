import axios from "axios";

import { getErrorMessage } from ".";
import { TCipher } from "../../types/cipher";
import { TApi } from "../../types/userType";
import { refreshToken } from "../jwt";
import { errorAlert } from "../sweetalert";

export const createVersionRequest = async (data: TCipher, api: TApi) => {
  await refreshToken(api);
  return axios({
    method: "POST",
    baseURL: api.url,
    url: "/me/versions/new",
    data,
    headers: { Authorization: `Bearer ${api.accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const getLastVersionRequest = async (api: TApi) => {
  await refreshToken(api);
  return axios({
    method: "GET",
    baseURL: api.url,
    url: "/me/versions/last",
    headers: { Authorization: `Bearer ${api.accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const getAllVersionsRequest = async (api: TApi) => {
  await refreshToken(api);
  return axios({
    method: "GET",
    baseURL: api.url,
    url: "/me/versions",
    headers: { Authorization: `Bearer ${api.accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const getVersionByIdRequest = async (
  versionId: number | string,
  api: TApi
) => {
  await refreshToken(api);
  return axios({
    method: "GET",
    baseURL: api.url,
    url: `/me/versions/${versionId}`,
    headers: { Authorization: `Bearer ${api.accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const deleteVersionByIdRequest = async (
  versionId: number | string,
  api: TApi
) => {
  await refreshToken(api);
  return axios({
    method: "DELETE",
    baseURL: api.url,
    url: `/me/versions/${versionId}`,
    headers: { Authorization: `Bearer ${api.accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};
