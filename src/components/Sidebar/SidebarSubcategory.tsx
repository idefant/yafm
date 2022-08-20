import classNames from 'classnames';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarSubcategoryProps {
  label: string;
  link: string;
}

const SidebarSubcategory: FC<SidebarSubcategoryProps> = ({ label, link }) => (
  <NavLink
    to={link}
    className={({ isActive }) => (
      classNames('block py-1.5 pl-8 pr-3 hover:bg-gray-600 text-sm', isActive && 'font-bold')
    )}
  >
    {label}
  </NavLink>
);

export default SidebarSubcategory;
