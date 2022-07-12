import { AxiosError } from "axios";

export const getErrorMessage = (error: AxiosError<any>) =>
  error.response?.data.message || "Неизвестная ошибка";
