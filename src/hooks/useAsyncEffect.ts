import { useEffect, useRef } from 'react';

import noop from '#utils/noop';

/* eslint-disable no-unused-vars */
type TDestructor = () => void;
type TSetDestructor = (newDestructor: TDestructor) => void;
type TEffect = (setDestructor: TSetDestructor) => Promise<void> | void;
/* eslint-enable no-unused-vars */

const useAsyncEff = (effect: TEffect, deps?: React.DependencyList) => {
  const effectRef = useRef(effect);
  effectRef.current = effect;

  const destructor = useRef(noop);
  const setDestructor = (newDestructor: TDestructor) => {
    destructor.current = newDestructor;
  };

  useEffect(() => {
    (async () => {
      await effect(setDestructor);
    })();

    return destructor.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAsyncEff;
