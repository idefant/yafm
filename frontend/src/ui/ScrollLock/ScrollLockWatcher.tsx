import { FC, useEffect } from 'react';

import './ScrollLockWatcher.scss';

export const ScrollLockWatcher: FC = () => {
  useEffect(() => {
    const timer = setInterval(() => {
      const scrollbarWidth = window.innerWidth - document.body.scrollWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return null;
};
