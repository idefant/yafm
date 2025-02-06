import mitt, { Emitter } from 'mitt';
import { useCallback, useMemo, useState } from 'react';
import { IfNever } from 'type-fest';

type ModalState<T> =
  | {
      isOpen: true;
      data: T;
    }
  | {
      isOpen: false;
      data?: T;
    };

type Events<T> = {
  open: ModalState<T>;
  close: ModalState<T>;
  changeData: ModalState<T>;
};

/* eslint-disable no-unused-vars */
export type UseModalReturn<T = never> = {
  open: (...params: IfNever<T, [], [T]>) => void;
  close: () => void;
  setIsOpen: (...params: IfNever<T, [true], [true, T]> | [false] | [false, unknown]) => void;
  addListener: Emitter<Events<T>>['on'];
  removeListener: Emitter<Events<T>>['off'];
} & ModalState<T>;
/* eslint-enable no-unused-vars */

export const useModal = <T = never>(
  ...params: [] | IfNever<T, [true], [true, T]> | [false]
): UseModalReturn<T> => {
  const [defaultIsOpen, defaultData] = params;
  const [emitter] = useState(mitt<Events<T>>());

  const [modal, setModal] = useState<ModalState<T>>({
    isOpen: defaultIsOpen ?? false,
    data: defaultData,
  } as any);

  const open: UseModalReturn<T>['open'] = useCallback(
    (...params) => {
      const [data] = params;
      setModal((prevModal) => {
        const newModal: ModalState<T> = { isOpen: true, data: data as T };
        if (!prevModal.isOpen) {
          emitter.emit('open', newModal);
        }
        if (prevModal.data !== data) {
          emitter.emit('changeData', newModal);
        }
        return newModal;
      });
    },
    [emitter],
  );

  const close: UseModalReturn<T>['close'] = useCallback(() => {
    setModal((prevValue) => {
      if (!prevValue.isOpen) return prevValue;
      const newModal: ModalState<T> = { isOpen: false, data: prevValue.data };
      emitter.emit('close', newModal);
      return newModal;
    });
  }, [emitter]);

  const setIsOpen: UseModalReturn<T>['setIsOpen'] = useCallback(
    (...params) => {
      const [newIsOpen, newData] = params;

      if (newIsOpen) {
        open(...([newData] as Parameters<typeof open>));
      } else {
        close();
      }
    },
    [close, open],
  );

  const result = useMemo(
    () => ({
      isOpen: modal.isOpen as any,
      open,
      close,
      setIsOpen,
      addListener: emitter.on,
      removeListener: emitter.off,
      data: modal.data,
    }),
    [close, emitter.off, emitter.on, modal.data, modal.isOpen, open, setIsOpen],
  );

  return result;
};
