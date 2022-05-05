export type TAccount = {
  id: string;
  name: string;
  balance: number;
  currency_code: string;
  category_id?: string;
  is_hide?: boolean;
  is_archive?: boolean;
};
