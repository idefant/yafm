import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import {
  ButtonHTMLAttributes,
  FC,
  FunctionComponent,
  SVGProps,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Text } from '#ui/Typography';

import cls from './ContextMenu.module.scss';

export type ContextMenuItem = ButtonHTMLAttributes<HTMLButtonElement> & {
  key: string;
  label: string;
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
};

interface ContextMenuProps {
  label?: string;
  items: ContextMenuItem[];
  getElement?: () => HTMLElement | null;
}

export const ContextMenu: FC<ContextMenuProps> = ({
  label,
  items,
  getElement = () => document.documentElement,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const listItemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listContentRef = useRef(items.map((item) => item.label));
  const allowMouseUpCloseRef = useRef(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: 4 }),
      flip({
        fallbackPlacements: ['left-start'],
      }),
      shift({ padding: 10 }),
    ],
    placement: 'right-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  const role = useRole(context, { role: 'menu' });
  const dismiss = useDismiss(context);
  const listNavigation = useListNavigation(context, {
    listRef: listItemsRef,
    onNavigate: setActiveIndex,
    activeIndex,
  });
  const typeahead = useTypeahead(context, {
    enabled: isOpen,
    listRef: listContentRef,
    onMatch: setActiveIndex,
    activeIndex,
  });

  const { getFloatingProps } = useInteractions([role, dismiss, listNavigation, typeahead]);

  useEffect(() => {
    let timeout: number;

    function onContextMenu(e: MouseEvent) {
      e.preventDefault();

      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: e.clientX,
            y: e.clientY,
            top: e.clientY,
            right: e.clientX,
            bottom: e.clientY,
            left: e.clientX,
          };
        },
      });

      setIsOpen(true);
      clearTimeout(timeout);

      allowMouseUpCloseRef.current = false;
      timeout = window.setTimeout(() => {
        allowMouseUpCloseRef.current = true;
      }, 300);
    }

    getElement()?.addEventListener('contextmenu', onContextMenu);
    return () => {
      getElement()?.removeEventListener('contextmenu', onContextMenu);
      clearTimeout(timeout);
    };
  }, [getElement, refs]);

  return (
    <FloatingPortal>
      {isOpen && (
        <FloatingOverlay className={cls.overlay}>
          <FloatingFocusManager context={context} initialFocus={refs.floating}>
            <div
              className={cls.ContextMenu}
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {label && (
                <Text color="secondary" block title={label} className={cls.label}>
                  {label}
                </Text>
              )}
              {items.map(({ label, key, icon: Icon, ...itemProps }, index) => (
                <button
                  className={cls.item}
                  type="button"
                  tabIndex={activeIndex === index ? 0 : -1}
                  ref={(node) => {
                    listItemsRef.current[index] = node;
                  }}
                  onClick={() => {
                    (itemProps.onClick as any)?.();
                    setIsOpen(false);
                  }}
                  onMouseUp={() => {
                    (itemProps.onClick as any)?.();
                    setIsOpen(false);
                  }}
                  key={key}
                  {...itemProps}
                >
                  {Icon && <Icon className={cls.itemIcon} />}
                  <span className={cls.itemLabel}>{label}</span>
                </button>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingOverlay>
      )}
    </FloatingPortal>
  );
};
