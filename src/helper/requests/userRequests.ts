import axios from "axios";

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
  });
};
