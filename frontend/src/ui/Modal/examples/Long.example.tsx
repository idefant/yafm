import { ComponentProps, FC } from 'react';

import { useModal } from '#hooks/useModal';
import { Button } from '#ui/Button';
import { Modal } from '#ui/Modal';

type LongExampleProps = Pick<
  ComponentProps<typeof Modal>,
  'title' | 'icon' | 'isOpen' | 'container' | 'disablePortal'
>;

const LongExample: FC<LongExampleProps> = ({
  title,
  icon,
  isOpen: isOpenByDefault,
  container,
  disablePortal,
}) => {
  const modal = useModal(isOpenByDefault);

  return (
    <>
      <Button onClick={modal.open}>Открыть модальное окно</Button>

      <div
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(255,243,0,1) 100%)',
          height: 3000,
        }}
      />

      <Modal
        isOpen={modal.isOpen}
        close={modal.close}
        title={title}
        icon={icon}
        container={container}
        disablePortal={disablePortal}
      >
        <Modal.Content>
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(255,243,0,1) 100%)',
              height: 2000,
            }}
          />
        </Modal.Content>
        <Modal.Footer>
          <Button color="secondary" onClick={modal.close}>
            Отмена
          </Button>
          <Button onClick={modal.close}>ОК</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default LongExample;
