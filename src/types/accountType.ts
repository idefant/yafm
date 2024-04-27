import { TCategory } from './categoryType';
import { TCurrency } from './currencyType';

export type TAccount = {
  id: string;
  name: string;
  currency_code: string;
  category_id?: string;
  is_archive?: boolean;
};

export type TAccountCombined = TAccount & {
  category?: TCategory;
  currency: TCurrency;
};
