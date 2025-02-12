import { FC } from 'react';

import { HeaderInfo } from '#components/Header';
import { SettingChangePassword, SettingBackup } from '#components/Setting';
import { Grid } from '#ui/Grid';

export const Setting: FC = () => (
  <>
    <HeaderInfo title="Settings" />

    <Grid gap={16}>
      <Grid.Item size={6}>
        <SettingChangePassword />
      </Grid.Item>

      <Grid.Item size={6}>
        <SettingBackup />
      </Grid.Item>
    </Grid>
  </>
);
