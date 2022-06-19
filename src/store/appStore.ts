import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

class AppStore {
  rootStore: RootStore;
  safeMode = true;
  archiveMode = false;
  isUnsaved = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setSafeMode(mode: boolean) {
    this.safeMode = mode;
  }

  setArchiveMode(mode: boolean) {
    this.archiveMode = mode;
  }

  setIsUnsaved(isUnsaved: boolean) {
    this.isUnsaved = isUnsaved;
  }
}

export default AppStore;
