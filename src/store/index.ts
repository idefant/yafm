import AccountStore from "./accountStore";
import AppStore from "./app";
import TransactionStore from "./transactionStore";

export class RootStore {
  app = new AppStore(this);
  account = new AccountStore(this);
  transaction = new TransactionStore(this);
}

export default new RootStore();
