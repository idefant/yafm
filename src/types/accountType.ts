export type TAccount = {
  id: string;
  name: string;
  balance: number;
  start_balance: number;
  disabled: boolean;
  currency_code: string;
  category_id?: string;
  is_hide: boolean;
  is_archive: boolean;
};
