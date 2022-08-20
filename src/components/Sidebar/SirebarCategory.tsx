import classNames from 'classnames';
import {
  FC,
  ReactNode,
  useReducer,
  useRef,
} from 'react';
import { NavLink, useResolvedPath, useLocation } from 'react-router-dom';

import Icon from '../Generic/Icon';

interface SidebarCategoryProps {
  icon: ReactNode;
  label: string;
  link: string;
  children?: ReactNode;
  notExist?: boolean;
}

const SidebarCategory: FC<SidebarCategoryProps> = ({
  icon,
  label,
  link,
  children,
  notExist,
}) => {
  const [isOpen, toggleIsOpen] = useReducer((state) => !state, false);
  const elementsWrapperRef = useRef<HTMLDivElement>(null);

  const { pathname: locationPathname } = useLocation();
  const { pathname: toPathname } = useResolvedPath(link);

  const isActive = locationPathname.split('/')?.[1] === toPathname.split('/')?.[1];

  return (
    <div className={classNames(isActive && 'bg-gray-600')}>
      <div className="flex hover:bg-gray-600 gap-0">
        <NavLink
          to={notExist ? '#' : link}
          className="flex gap-5 py-2 px-4 flex-1"
          onClick={notExist ? toggleIsOpen : undefined}
        >
          {icon}
          {label}
        </NavLink>
        {children && (
          <button
            type="button"
            className="px-3 block"
            onClick={toggleIsOpen}
          >
            <Icon.ChevronLeft className={classNames('transition-all', isOpen && '-rotate-90')} />
          </button>
        )}
      </div>

      <div
        className="overflow-hidden transition-all"
        style={{ height: isOpen ? elementsWrapperRef.current?.clientHeight : 0 }}
      >
        <div ref={elementsWrapperRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SidebarCategory;
