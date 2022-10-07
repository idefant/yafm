import { FC } from 'react';

import { Title } from '../../Generic/Title';

import SettingBackup from './SettingBackup';
import SettingChangePassword from './SettingChangePassword';

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
