import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { TAlertType } from "../types/alertType";
import { TButtonColor } from "../types/buttonType";

class AppStore {
  rootStore: RootStore;
  alert?: {
    type?: TAlertType;
    title: string;
    text?: string;
    isOpen: boolean;
    buttons: { text: string; color?: TButtonColor; onClick?: () => void }[];
  };

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  openAlert({
    type,
    title,
    text,
    buttons,
  }: {
    type?: TAlertType;
    title: string;
    text?: string;
    buttons?: { text: string; color?: TButtonColor; onClick?: () => void }[];
  }) {
    this.alert = {
      type,
      title,
      text,
      isOpen: true,
      buttons: buttons || [],
    };
  }

  closeAlert() {
    this.alert && (this.alert.isOpen = false);
  }
}

export default AppStore;
