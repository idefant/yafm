import { FC } from "react";

import { Title } from "../../Generic/Title";
import SettingChangePassword from "./SettingChangePassword";
import SettingBackup from "./SettingBackup";

const Setting: FC = () => {
  return (
    <>
      <Title>Setting</Title>
      <SettingChangePassword />
      <SettingBackup />
    </>
  );
};

export default Setting;
