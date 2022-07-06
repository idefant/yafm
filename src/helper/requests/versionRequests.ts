import axios from "axios";
import { getErrorMessage } from ".";
import { TApi } from "../../types/userType";
import { refreshToken } from "../jwt";
import { errorAlert } from "../sweetalert";

export const createVersionRequest = async (
  iv: string,
  hmac: string,
  cipher: string,
  accessToken: string,
  api: TApi
) => {
  await refreshToken(api, accessToken);
  return axios({
    method: "POST",
    baseURL: api.url,
    url: "/me/versions/new",
    data: { iv, hmac, cipher },
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const getLastVersionRequest = async (accessToken: string, api: TApi) => {
  await refreshToken(api, accessToken);
  return axios({
    method: "GET",
    baseURL: api.url,
    url: "/me/versions/last",
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const getAllVersionsRequest = async (accessToken: string, api: TApi) => {
  await refreshToken(api, accessToken);
  return axios({
    method: "GET",
    baseURL: api.url,
    url: "/me/versions",
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const getVersionByIdRequest = async (
  versionId: number | string,
  accessToken: string,
  api: TApi
) => {
  await refreshToken(api, accessToken);
  return axios({
    method: "GET",
    baseURL: api.url,
    url: `/me/versions/${versionId}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const deleteVersionByIdRequest = async (
  versionId: number | string,
  accessToken: string,
  api: TApi
) => {
  await refreshToken(api, accessToken);
  return axios({
    method: "DELETE",
    baseURL: api.url,
    url: `/me/versions/${versionId}`,
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};
