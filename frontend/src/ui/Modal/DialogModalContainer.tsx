import mitt from 'mitt';
import { nanoid } from 'nanoid';
import { FC, useEffect, useState } from 'react';
import { Except } from 'type-fest';

import { Button } from '#ui/Button';

import { Modal } from './Modal';
import { ModalData, ModalParams } from './modalType';

type Events = {
  open: ModalParams<any, any> & { id: string };
  runAction: { modalId: string; action: 'confirm' | 'cancel' };
  close: string;
};

const emitter = mitt<Events>();

type OpenModalReturn<S, T> = Promise<
  | {
      isConfirmed: true;
      isCanceled: false;
      status: 'confirmed';
      value: T;
    }
  | {
      isConfirmed: false;
      isCanceled: true;
      status: 'cancelled';
      value: S;
    }
>;

function openModal<S = undefined, T = undefined>(
  modalParams: ModalParams<S, T>,
): OpenModalReturn<S, T> {
  const newModalId = nanoid();
  emitter.emit('open', { id: newModalId, ...modalParams });

  return new Promise<Awaited<OpenModalReturn<S, T>>>((resolve) => {
    const handler = async ({ modalId, action }: Events['runAction']) => {
      if (newModalId !== modalId) return;

      if (action === 'confirm') {
        resolve({
          isConfirmed: true,
          isCanceled: false,
          status: 'confirmed',
          value: (await modalParams.preConfirm?.()) as T,
        });
        emitter.emit('close', modalId);
      }

      if (action === 'cancel') {
        resolve({
          isConfirmed: false,
          isCanceled: true,
          status: 'cancelled',
          value: (await modalParams.preCancel?.()) as S,
        });
        emitter.emit('close', modalId);
      }

      emitter.off('runAction', handler);
    };

    emitter.on('runAction', handler);
  });
}

/**
 * Утилита для работы с диалоговыми модальными окнами в функциональном стиле.
 *
 * @example
 * dmodal.ok({ title: 'Данные были сохранены' });
 *
 * dmodal({ title: 'Покинуть страницу?' }).then(({ isConfirmed }) => {
 *   if (isConfirmed) {
 *     navigate('/');
 *   }
 * });
 */
export const dmodal = Object.assign(openModal, {
  warn: <S, T>(value: Except<ModalParams<S, T>, 'icon'>) =>
    openModal({ ...value, icon: 'warning' }),
  error: <S, T>(value: Except<ModalParams<S, T>, 'icon'>) => openModal({ ...value, icon: 'error' }),
  ok: <S, T>(value: Except<ModalParams<S, T>, 'icon'>) => openModal({ ...value, icon: 'success' }),
});

interface DialogModalContainerProps {
  maxCount?: number;
}

export const DialogModalContainer: FC<DialogModalContainerProps> = ({ maxCount = 10 }) => {
  const [modals, setModals] = useState<ModalData<any, any>[]>([]);
  const [preActionModalId, setPreActionModalId] = useState<string>();

  useEffect(() => {
    const handler = ({ id, ...params }: Events['open']) => {
      setModals((modals) => [...modals, { id, ...params }]);
    };

    emitter.on('open', handler);
    return () => emitter.off('open', handler);
  }, [maxCount]);

  useEffect(() => {
    const handler = (id: Events['close']) => {
      setModals((modals) => modals.filter((modalItem) => modalItem.id !== id));
      setPreActionModalId(undefined);
    };

    emitter.on('close', handler);
    return () => emitter.off('close', handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const hasPopup = !!document.querySelector('.yafm_Popup');
      if (!hasPopup) {
        const scrollbarWidth = window.innerWidth - document.body.scrollWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {modals.map(
        ({
          id,
          title,
          icon,
          content,
          cancelText = 'Отмена',
          confirmText = 'ОК',
          showCancel = true,
          showConfirm = true,
          cancelColor = 'secondary',
          confirmColor = 'primary',
          container,
          disablePortal,
        }) => {
          const disabled = preActionModalId === id;

          const handleCancel = () => {
            setPreActionModalId(id);
            emitter.emit('runAction', { modalId: id, action: 'cancel' });
          };

          const handleSubmit = async () => {
            setPreActionModalId(id);
            emitter.emit('runAction', { modalId: id, action: 'confirm' });
          };

          return (
            <Modal
              key={id}
              isOpen
              close={handleCancel}
              title={title}
              icon={icon}
              container={container}
              disablePortal={disablePortal}
              refocus
            >
              {content && <Modal.Content>{content}</Modal.Content>}

              <Modal.Footer>
                {showCancel && (
                  <Button color={cancelColor} onClick={handleCancel} disabled={disabled}>
                    {cancelText}
                  </Button>
                )}

                {showConfirm && (
                  <Button color={confirmColor} onClick={handleSubmit} disabled={disabled}>
                    {confirmText}
                  </Button>
                )}
              </Modal.Footer>
            </Modal>
          );
        },
      )}
    </>
  );
};
