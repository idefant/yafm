import { observer } from "mobx-react-lite";
import { FC } from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import { CrossCircleIcon, CrossIcon } from "../../assets/svg";
import store from "../../store";
import Button from "./Button";

const Alert: FC = observer(() => {
  const alert = store.app.alert;

  return createPortal(
    <CSSTransition
      in={alert && alert.isOpen}
      timeout={300}
      mountOnEnter={true}
      unmountOnExit={true}
      classNames={{
        enter: "opacity-0",
        enterActive: "opacity-100",
        exitActive: "opacity-0",
      }}
    >
      <div
        className="fixed inset-0 bg-gray-800/60 transition ease-in-out duration-300"
        onClick={() => store.app.closeAlert()}
      >
        <div
          className="h-[calc(100%-3.5rem)] max-w-md mx-auto my-7"
          onClick={() => store.app.closeAlert()}
        >
          <div
            className="bg-white flex flex-col overflow-hidden max-h-full rounded-lg items-center relative p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => store.app.closeAlert()}
              className="absolute top-2 right-2"
            >
              <CrossIcon />
            </button>
            <CrossCircleIcon className="text-red-600 w-24 h-24" />
            <h2 className="text-xl font-bold">{alert?.title}</h2>
            {alert?.text && <div>{alert?.text}</div>}
            <div className="flex gap-4 mt-4">
              {alert?.buttons.map((button) => (
                <Button color={button.color} onClick={button.onClick}>
                  {button.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.body
  );
});

export default Alert;
