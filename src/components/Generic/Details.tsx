import classNames from 'classnames';
import {
  FC, ReactNode, useReducer, useRef, useState,
} from 'react';

import useInterval from '../../hooks/useInterval';

import Icon from './Icon';

interface DetailsProps {
  title: string;
  children?: ReactNode;
}

const Details: FC<DetailsProps> = ({ title, children }) => {
  const [isOpen, toggleIsOpen] = useReducer((isOpen) => !isOpen, false);
  const [contentHeight, setContentHeight] = useState(0);
  const refContent = useRef<HTMLDivElement>(null);

  useInterval({
    callback: () => {
      if (refContent.current) {
        setContentHeight(refContent.current.scrollHeight);
      }
    },
    interval: 200,
    isWorking: true,
  });

  return (
    <div className="w-full border-2 border-gray-500 rounded-lg overflow-hidden">
      <button
        className="w-full bg-slate-800 p-2 flex gap-2"
        onClick={toggleIsOpen}
        type="button"
      >
        <Icon.ChevronRight
          className={classNames('transition-all w-8', isOpen && 'rotate-90')}
        />
        <div>{title}</div>
      </button>
      <div
        className={classNames('w-full overflow-hidden transition-all bg-slate-800 border-t-slate-100/30', isOpen && 'border-t-2')}
        style={{ height: isOpen ? contentHeight : 0 }}
      >
        <div ref={refContent} className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Details;
