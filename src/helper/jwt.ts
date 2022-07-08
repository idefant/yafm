import jwt_decode from "jwt-decode";

import { updateTokens } from "../store/reducers/userSlice";
import { store } from "../store/store";
import { TApi } from "../types/userType";
import { refreshTokenRequest } from "./requests/userRequests";

export const checkToken = (token: string) => {
  const decodedToken: { exp: number } = jwt_decode(token);
  return Date.now() < (decodedToken.exp - 30) * 1000;
};

export const refreshToken = async (api: TApi) => {
  if (api.accessToken && checkToken(api.accessToken)) return true;

  const response = await refreshTokenRequest(
    api.url,
    api.username,
    api.refreshToken
  );

  if (!response) return false;
  store.dispatch(
    updateTokens({
      refreshToken: response.data.refresh_token,
      accessToken: response.data.access_token,
    })
  );
  return true;
};
