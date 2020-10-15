import {useEffect, useRef, useReducer} from 'react';

export type FunctionType = (...args: any) => any;

export interface Callback<T = any> {
  id: symbol;
  fn: T;
}

// hook that runs callback only on update, not on initial mount
export const useUpdateEffect = (callback: () => void, deps: any[]) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    callback();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

const areCallbacksEqual = (cb1: Callback, cb2: Callback) => {
  return cb1.id === cb2.id;
};

const useRerender = () => useReducer(s => s + 1, 0)[1];

// NOTE: callback collection is implemented via ref (instead of state) because of the use cases where we
// need to have updated collection immediately instead of waiting for the next rendering cycle
export const useCallbackManager = <T = FunctionType>() => {
  const callbacks = useRef<Callback<T>[]>([]);
  const rerender = useRerender();

  const register = (cb: Callback<T>) => {
    const {id, fn} = cb;

    callbacks.current.push({id, fn});
    rerender();
  };

  const update = (cb: Callback<T>) => {
    const {id, fn} = cb;

    const updateIndex = callbacks.current.findIndex((item) => areCallbacksEqual(item, {id, fn}));

    if (updateIndex !== -1) {
      callbacks.current[updateIndex].fn = fn;
      rerender();
    }
  };

  const remove = (cb: Callback<T>) => {
    const {id, fn} = cb;

    const removeIndex = callbacks.current.findIndex((item) => areCallbacksEqual(item, {id, fn}));

    if (removeIndex !== -1) {
      callbacks.current.splice(removeIndex, 1);
      rerender();
    }
  };

  useEffect(() => { // clear effects callback on unmount
    return () => {
      callbacks.current = [];
    };
  }, []);

  return {
    callbacks: callbacks.current,
    register,
    update,
    remove,
  };
};
