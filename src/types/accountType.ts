export type TAccount = {
  id: string;
  name: string;
  currency_code: string;
  category_id?: string;
  is_hide?: boolean;
  is_archive?: boolean;
};

export type TCalculatedAccount = TAccount & {
  balance: number;
  last_activity?: number;
};
