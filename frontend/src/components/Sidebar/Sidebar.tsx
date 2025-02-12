import classNames from 'classnames';
import { FC, FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';

import { appRoutes } from '#data/routes';
import BankCardIcon from '#svg/bank-card.svg?react';
import CopyIcon from '#svg/copy.svg?react';
import DollarIcon from '#svg/dollar.svg?react';
import Logo from '#svg/logo.svg?react';
import PieChartIcon from '#svg/pie-chart.svg?react';
import SettingsIcon from '#svg/settings.svg?react';
import SwapIcon from '#svg/swap.svg?react';
import TagIcon from '#svg/tag.svg?react';

import cls from './Sidebar.module.scss';

const navItems: { label: string; link: string; icon: FunctionComponent }[] = [
  { label: 'Dashboard', link: appRoutes.dashboard, icon: PieChartIcon },
  { label: 'Accounts', link: appRoutes.accounts, icon: BankCardIcon },
  { label: 'Transactions', link: appRoutes.transactions, icon: SwapIcon },
  { label: 'Templates', link: appRoutes.templates, icon: CopyIcon },
  { label: 'Categories', link: appRoutes.categories, icon: TagIcon },
  { label: 'Currencies', link: appRoutes.currencies, icon: DollarIcon },
  { label: 'Settings', link: appRoutes.settings, icon: SettingsIcon },
];

export const Sidebar: FC = () => (
  <aside className={cls.Sidebar}>
    <div className={cls.logoContainer}>
      <Logo />
    </div>
    <nav className={cls.navigation}>
      {navItems.map((navItem) => (
        <NavLink
          to={navItem.link}
          className={({ isActive }) => classNames(cls.navItem, { [cls.navItemActive]: isActive })}
          key={navItem.link}
        >
          <navItem.icon />
          {navItem.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);
