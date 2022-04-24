export type TCategory = {
  id: string;
  name: string;
  is_hide?: boolean;
  is_archive?: boolean;
};

export type TCategoryType = "accounts" | "transactions";
