import { FC } from 'react';

import { HeaderInfo } from '#components/Header';
import { SettingChangePassword, SettingBackup } from '#components/Setting';

const Setting: FC = () => (
  <>
    <HeaderInfo title="Settings" />

    <div className="grid grid-cols-2 items-start gap-4">
      <SettingChangePassword />
      <SettingBackup />
    </div>
  </>
);

export default Setting;
