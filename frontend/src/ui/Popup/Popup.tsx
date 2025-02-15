import classNames from 'classnames';
import { FC, ReactNode, useRef } from 'react';
import { FocusOn } from 'react-focus-on';
import { CSSTransition } from 'react-transition-group';

import { Portal } from '#ui/Portal';

import cls from './Popup.module.scss';
import { PopupClasses } from './popupType';

export interface PopupProps {
  /** Открыт ли попап */
  isOpen: boolean;
  /** Закрывает попап */
  close?: () => void;
  children?: ReactNode;
  /** Классы вложенных элементов */
  classes?: PopupClasses;
  /** Включает фокусировку при открытии на первом интерактивном элементе */
  refocus?: boolean;
  /** Функция, которая будет вызываться, перед открытием */
  onOpen?: () => void;
  /** Функция, которая будет вызываться во время открытия */
  onOpening?: () => void;
  /** Функция, которая будет вызываться сразу после открытия */
  onOpened?: () => void;
  /** Функция, которая будет вызываться, перед закрытием */
  onExit?: () => void;
  /** Функция, которая будет вызываться, во время закрытия */
  onExiting?: () => void;
  /** Функция, которая будет вызываться, сразу после закрытия */
  onExited?: () => void;
  /** Узел, в котором будет находиться `children`. По умолчанию: `document.body` */
  container?: HTMLElement;
  /** `children` будет находится в иерархии родительского компонента */
  disablePortal?: boolean;
}

export const Popup: FC<PopupProps> = ({
  isOpen,
  close,
  children,
  classes,
  refocus = true,
  onOpen,
  onOpening,
  onOpened,
  onExit,
  onExiting,
  onExited,
  container,
  disablePortal,
}) => {
  const nodeRef = useRef(null);
  const isOpenByDefault = useRef(isOpen);

  return (
    <Portal container={container} disablePortal={disablePortal}>
      <CSSTransition
        in={isOpen}
        timeout={200}
        mountOnEnter
        unmountOnExit
        classNames={{
          enter: cls.enter,
          enterActive: cls.enterActive,
          enterDone: cls.enterDone,
          exit: cls.exit,
          exitActive: cls.exitActive,
        }}
        onEnter={onOpen}
        onEntering={onOpening}
        onEntered={onOpened}
        onExit={() => {
          onExit?.();
          isOpenByDefault.current = false;
        }}
        onExiting={onExiting}
        onExited={onExited}
        nodeRef={nodeRef}
      >
        <FocusOn
          enabled={refocus}
          onEscapeKey={close}
          className="yafm_Popup_FocusOn"
          scrollLock={false}
        >
          <div
            className={classNames(cls.Popup, classes?.container, 'yafm_Popup', {
              [cls.defaultOpen]: isOpenByDefault.current && isOpen,
            })}
            ref={nodeRef}
          >
            <div className={classNames(cls.backdrop, classes?.backdrop)} onClick={close}>
              <div className={classNames(cls.windowOuter, classes?.windowOuter)}>
                <div
                  className={classNames(cls.window, classes?.window)}
                  onClick={(e) => e.stopPropagation()}
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
        </FocusOn>
      </CSSTransition>
    </Portal>
  );
};
