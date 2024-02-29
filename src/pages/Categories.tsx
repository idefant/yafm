import { FC } from 'react';

import { Title } from '#ui/Title';

import CategoriesPart from './CategoriesPart';

const Categories: FC = () => (
  <>
    <Title>Categories</Title>

    <div className="grid grid-cols-2 gap-4 items-start">
      <CategoriesPart categoryType="accounts" />
      <CategoriesPart categoryType="transactions" />
    </div>
  </>
);

export default Categories;
