import AccountStore from "./accountStore";
import AppStore from "./app";

export class RootStore {
  app = new AppStore(this);
  account = new AccountStore(this);
}

export default new RootStore();
