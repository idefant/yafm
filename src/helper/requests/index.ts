import { AxiosError } from "axios";

export const getErrorMessage = (error: AxiosError) =>
  error.response?.data.message || "Неизвестная ошибка";
