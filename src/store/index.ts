import AccountStore from "./accountStore";
import AppStore from "./appStore";
import CurrencyStore from "./currencyStore";
import SettingStore from "./settingStore";
import TransactionStore from "./transactionStore";

export class RootStore {
  app = new AppStore(this);
  account = new AccountStore(this);
  transaction = new TransactionStore(this);
  currency = new CurrencyStore(this);
  setting = new SettingStore(this);
}

export default new RootStore();
