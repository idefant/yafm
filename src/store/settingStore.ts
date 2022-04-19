import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

class SettingStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
}

export default SettingStore;
