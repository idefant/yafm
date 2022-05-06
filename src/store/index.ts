import AccountStore from "./accountStore";
import AppStore from "./appStore";
import CategoryStore from "./categoryStore";
import CurrencyStore from "./currencyStore";
import TransactionStore from "./transactionStore";
import UserStore from "./userStore";

export class RootStore {
  account = new AccountStore(this);
  transaction = new TransactionStore(this);
  currency = new CurrencyStore(this);
  user = new UserStore(this);
  category = new CategoryStore(this);
  app = new AppStore(this);
}

export default new RootStore();
