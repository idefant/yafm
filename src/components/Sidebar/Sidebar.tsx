import { FC } from 'react';

import Icon from '../Generic/Icon';

import SidebarSubcategory from './SidebarSubcategory';
import SidebarCategory from './SirebarCategory';

const Sidebar: FC = () => (
  <aside className="w-60 bg-gray-700 text-white overflow-auto py-2 fixed top-[60px] left-0 bottom-0">
    <nav>
      <SidebarCategory label="Dashboard" link="/" icon={<Icon.Home />} />
      <SidebarCategory label="Accounts" link="/accounts" icon={<Icon.CreditCard />} />
      <SidebarCategory label="Transactions" link="/transactions" icon={<Icon.Repeat />} />
      <SidebarCategory label="Templates" link="/templates" icon={<Icon.Copy />} />

      <SidebarCategory label="Categories" link="/categories" icon={<Icon.Tag />} notExist>
        <SidebarSubcategory label="Account" link="/categories/accounts" />
        <SidebarSubcategory label="Transactions" link="/categories/transactions" />
      </SidebarCategory>
      <SidebarCategory label="Settings" link="/setting" icon={<Icon.Setting />} />
    </nav>
  </aside>
);

export default Sidebar;
