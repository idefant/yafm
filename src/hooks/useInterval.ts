import {
  DependencyList,
  useEffect,
  useRef,
  useState,
} from 'react';

interface useIntervalProps {
  callback: () => void;
  isWorking?: boolean;
  interval?: number;
  delay?: number;
  deps?: DependencyList;
}

const useInterval = ({
  callback,
  isWorking: isWorkingDefault = false,
  interval = 10,
  delay = 0,
  deps = [],
}: useIntervalProps) => {
  const [isWorking, setIsWorking] = useState(isWorkingDefault);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    let intervalTimerId: number | undefined;
    let timeoutTimerId: number | undefined;

    if (isWorking) {
      savedCallback.current();

      timeoutTimerId = window.setTimeout(() => {
        intervalTimerId = window.setInterval(savedCallback.current, interval);
      }, delay);
    }

    return () => {
      clearInterval(intervalTimerId);
      clearTimeout(timeoutTimerId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWorking, savedCallback, interval, delay, ...deps]);

  const start = () => setIsWorking(true);
  const stop = () => setIsWorking(false);

  return { start, stop };
};

export default useInterval;
