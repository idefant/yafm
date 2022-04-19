import jwt_decode from "jwt-decode";
import store from "../store";
import { TApi } from "../types/userType";
import { refreshTokenRequest } from "./requests/userRequests";

export const checkToken = (token: string) => {
  const decodedToken: { exp: number } = jwt_decode(token);
  return Date.now() < (decodedToken.exp - 30) * 1000;
};

export const refreshToken = async (api: TApi, token?: string) => {
  if (token && checkToken(token)) return true;

  const serverResponse = await refreshTokenRequest(
    api.url,
    api.username,
    api.refreshToken,
    window.navigator.userAgent
  );

  if (!serverResponse) return false;
  store.user.updateTokens(
    serverResponse.data.refresh_token,
    serverResponse.data.access_token
  );
  return true;
};
