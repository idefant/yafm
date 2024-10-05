import { Category } from './categoryType';
import { Currency } from './currencyType';

export type Account = {
  id: string;
  name: string;
  currency_code: string;
  category_id?: string;
  is_archive?: boolean;
};

export type AccountCombined = Account & {
  category?: Category;
  currency: Currency;
};
