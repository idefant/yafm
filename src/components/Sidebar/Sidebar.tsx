import classNames from 'classnames';
import { FC } from 'react';

import { useAppSelector } from '../../hooks/reduxHooks';
import Icon from '../Generic/Icon';

import SidebarCategory from './SirebarCategory';

const Sidebar: FC = () => {
  const { openedModalsCount } = useAppSelector((state) => state.app);

  return (
    <aside
      className={classNames(
        'w-60 bg-slate-900 text-white overflow-auto py-2 fixed top-[60px] left-0 bottom-0',
        openedModalsCount && 'blur',
      )}
    >
      <nav>
        <SidebarCategory label="Dashboard" link="/" icon={<Icon.Home />} />
        <SidebarCategory label="Accounts" link="/accounts" icon={<Icon.CreditCard />} />
        <SidebarCategory label="Transactions" link="/transactions" icon={<Icon.Repeat />} />
        <SidebarCategory label="Templates" link="/templates" icon={<Icon.Copy />} />
        <SidebarCategory label="Categories" link="/categories" icon={<Icon.Tag />} />
        <SidebarCategory label="Settings" link="/setting" icon={<Icon.Setting />} />
      </nav>
    </aside>
  );
};

export default Sidebar;
