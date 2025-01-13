export type Category = {
  id: string;
  name: string;
  is_archive?: boolean;
};

export type CategoryType = 'accounts' | 'transactions';
