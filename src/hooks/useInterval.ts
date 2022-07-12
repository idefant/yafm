import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay = 1000) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    if (delay < 0) return;

    savedCallback.current();
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

export default useInterval;
