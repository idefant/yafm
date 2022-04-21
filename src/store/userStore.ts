import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { RootStore } from ".";
import { TApi } from "../types/userType";

class UserStore {
  rootStore: RootStore;
  api?: TApi;
  accessToken?: string;
  aesPass?: string;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "api",
      properties: ["api"],
      storage: window.localStorage,
    });
    this.rootStore = rootStore;
  }

  login(
    url: string,
    username: string,
    refreshToken: string,
    accessToken: string
  ) {
    this.api = { url, username, refreshToken };
    this.accessToken = accessToken;
  }

  logout() {
    this.api = undefined;
    this.accessToken = undefined;
    this.aesPass = undefined;
  }

  updateTokens(refreshToken: string, accessToken: string) {
    if (this.api) {
      this.api.refreshToken = refreshToken;
      this.accessToken = accessToken;
    }
  }

  setAesPass(aesPass: string) {
    this.aesPass = aesPass;
  }

  clearAesPass() {
    this.aesPass = undefined;
  }
}

export default UserStore;
