import AccountStore from "./accountStore";
import AppStore from "./appStore";
import CurrencyStore from "./currencyStore";
import SettingStore from "./settingStore";
import TransactionStore from "./transactionStore";
import UserStore from "./userStore";

export class RootStore {
  app = new AppStore(this);
  account = new AccountStore(this);
  transaction = new TransactionStore(this);
  currency = new CurrencyStore(this);
  setting = new SettingStore(this);
  user = new UserStore(this);
}

export default new RootStore();
