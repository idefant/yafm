import { FC } from 'react';

import { HeaderInfo } from '#components/Header';

import CategoriesPart from './CategoriesPart';

const Categories: FC = () => (
  <>
    <HeaderInfo title="Categories" />

    <div className="grid grid-cols-2 gap-4 items-start">
      <CategoriesPart categoryType="accounts" />
      <CategoriesPart categoryType="transactions" />
    </div>
  </>
);

export default Categories;
