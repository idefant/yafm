import axios from "axios";
import { getErrorMessage } from ".";
import { errorAlert } from "../sweetalert";

export const loginRequest = (
  serverUrl: string,
  username: string,
  password: string,
  useragent: string
) => {
  return axios({
    method: "POST",
    baseURL: serverUrl,
    url: "/auth/login",
    headers: {
      "X-Username": username,
      "X-Password": password,
    },
    data: {
      useragent,
    },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const refreshTokenRequest = (
  serverUrl: string,
  username: string,
  refreshToken: string,
  useragent: string
) => {
  return axios({
    method: "POST",
    baseURL: serverUrl,
    url: "/auth/refreshToken",
    data: {
      refresh_token: refreshToken,
      username: username,
      useragent,
    },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};
