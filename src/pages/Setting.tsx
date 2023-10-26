import { FC } from 'react';

import { SettingBackup, SettingChangePassword } from '../components/Setting';
import { Title } from '../UI/Title';

const Setting: FC = () => (
  <>
    <Title>Setting</Title>
    <div className="grid grid-cols-2 items-start gap-4">
      <SettingChangePassword />
      <SettingBackup />
    </div>
  </>
);

export default Setting;
