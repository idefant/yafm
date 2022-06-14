import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

class AppStore {
  rootStore: RootStore;
  safeMode = true;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setSafeMode(mode: boolean) {
    this.safeMode = mode;
  }
}

export default AppStore;