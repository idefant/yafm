import { compress } from "compress-json";
import store from "../store";

export const getSyncData = (isCompress?: boolean) => {
  const data = {
    accounts: store.account.accounts,
    transactions: store.transaction.transactions,
    categories: {
      accounts: store.category.accounts,
      transactions: store.category.transactions,
    },
    templates: store.transaction.templates,
  };

  if (isCompress) {
    return JSON.stringify(compress(JSON.parse(JSON.stringify(data))));
  }
  return JSON.stringify(data);
};
