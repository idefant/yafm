import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { RootStore } from ".";

class SettingStore {
  rootStore: RootStore;
  password = "";
  tg = { botToken: "", chatId: "" };

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "setting",
      properties: ["tg", "password"],
      storage: window.localStorage,
    });
    this.rootStore = rootStore;
  }

  setTg(botToken: string, chatId: string) {
    this.tg = { botToken, chatId };
  }

  setPassword(password: string) {
    this.password = password;
  }
}

export default SettingStore;
