import { FC } from 'react';

import { HeaderInfo } from '#components/Header';
import { Grid } from '#ui/Grid';

import { CategoriesPart } from './CategoriesPart';

export const Categories: FC = () => (
  <>
    <HeaderInfo title="Categories" />

    <Grid gap={16}>
      <Grid.Item size={6}>
        <CategoriesPart categoryType="transactions" />
      </Grid.Item>

      <Grid.Item size={6}>
        <CategoriesPart categoryType="accounts" />
      </Grid.Item>
    </Grid>
  </>
);
