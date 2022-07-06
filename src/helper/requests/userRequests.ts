import axios from "axios";
import { getErrorMessage } from ".";
import { errorAlert } from "../sweetalert";

export const loginRequest = (
  serverUrl: string,
  username: string,
  password: string
) => {
  return axios({
    method: "POST",
    baseURL: serverUrl,
    url: "/auth",
    data: { username, password },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};

export const refreshTokenRequest = (
  serverUrl: string,
  username: string,
  refreshToken: string
) => {
  return axios({
    method: "POST",
    baseURL: serverUrl,
    url: "/me/refreshToken",
    data: {
      refresh_token: refreshToken,
      username,
    },
  }).catch((error) => {
    errorAlert({ title: getErrorMessage(error) });
  });
};
