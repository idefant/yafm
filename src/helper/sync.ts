import store from "../store";

export const getSyncData = () => {
  const data = {
    accounts: store.account.accounts,
    transactions: store.transaction.transactions,
    categories: {
      accounts: store.category.accounts,
      transactions: store.category.transactions,
    },
  };
  return JSON.stringify(data);
};
