import { FC } from 'react';

import { Title } from '../../Generic/Title';

import SettingBackup from './SettingBackup';
import SettingChangePassword from './SettingChangePassword';

const Setting: FC = () => (
  <>
    <Title>Setting</Title>
    <SettingChangePassword />
    <SettingBackup />
  </>
);

export default Setting;
