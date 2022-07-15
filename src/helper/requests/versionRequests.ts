import axios from "axios";
import Swal from "sweetalert2";

import { getErrorMessage } from ".";
import { TCipher } from "../../types/cipher";

export const setBaseRequest = (data: TCipher, baseURL: string) => {
  return axios({
    method: "POST",
    baseURL,
    url: "/base",
    data,
  }).catch((error) => {
    Swal.fire({ title: getErrorMessage(error), icon: "error" });
  });
};

export const getBaseRequest = (baseURL: string) => {
  return axios({
    method: "GET",
    baseURL,
    url: "/base",
  }).catch((error) => {
    Swal.fire({ title: getErrorMessage(error), icon: "error" });
  });
};

export const getVersionListRequest = (baseURL: string) => {
  return axios({
    method: "GET",
    baseURL,
    url: "/base/versions",
  }).catch((error) => {
    Swal.fire({ title: getErrorMessage(error), icon: "error" });
  });
};

export const getVersionByFilenameRequest = (
  filename: string,
  baseURL: string
) => {
  return axios({
    method: "GET",
    baseURL,
    url: `/base/versions/${filename}`,
  }).catch((error) => {
    Swal.fire({ title: getErrorMessage(error), icon: "error" });
  });
};
