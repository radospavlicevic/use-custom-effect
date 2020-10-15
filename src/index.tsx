import {useCallback, useEffect, useRef} from 'react';
import {useCallbackManager, useUpdateEffect} from './helpers';
import {Callback} from './helpers';

type FunctionType = (...args: any[]) => any;
type EffectCallback<T> = (fn: T, deps?: any[], debuggingId?: string) => void;
type CustomEffectReturnType<T extends FunctionType> = [EffectCallback<T>, (...params: Parameters<T>) => void];

const createEffect = <T extends FunctionType> ({
  register,
  update,
  remove,
}: {
  register: (cb: Callback<T>) => void;
  update: (cb: Callback<T>) => void;
  remove: (cb: Callback<T>) => void;
}): EffectCallback<T> => {
  return (fn, deps= [], debuggingId) => {
    const id = useRef<symbol>();
    const callbackFn = useCallback(fn, deps);

    useUpdateEffect(() => {
      if (id.current) {
        update({id: id.current, fn: callbackFn});
      }
    }, [callbackFn]);

    useEffect(() => {
      id.current = Symbol(debuggingId);
      register({id: id.current, fn: callbackFn});

      return () => {
        if (id.current) {
          remove({id: id.current, fn: callbackFn});
        }
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  };
};

// useCustomEffect hook enables possibility to create effect which is triggered by some runtime event;
// useCustomEffect API extracts array with two output items:

// - [0]: useCustomEffectHook - custom effect hook that accepts 3 arguments (checkout createEffect function which creates custom effect hook):
//    * fn - callback function (like subscriber) which runs every time when specified runtime event triggers;
//    * deps - dependency array where you have to put all dynamic params used in callback function (otherwise you callback won't use fresh params)
//    * debuggingId - symbol identifier is used for each callback function, so if you want to specify readable id for debugging purposes, you can
//      do that by defining debuggingId;
// useCustomEffectHook can be used multiple times in a different components on a different levels;
// consumer just need to have an access to the useCustomEffectHook to be able to subscribe to the custom effect

// - [1]: run - function that specifies the effect trigger;
// run function can accept parameters which should be passed to the custom effect hook callback.

// useCustomEffect is powered by standard observer pattern implementation
// (effect event acts as observable and callbacks passed to custom effect hook act as observers)
// observers management (subscribe, callback updates & unsubscribe) is handled under the hood by including consumer components lifecycle
// (checkout createEffect function implementation)
export const useCustomEffect = <T extends FunctionType> (): CustomEffectReturnType<T> => {
  // useCallbackManager - callbacks/observers CRUD service
  const {
    callbacks,
    register,
    update,
    remove,
  } = useCallbackManager<T>();

  const useCustomEffectHook = createEffect<T>({
    register,
    update,
    remove,
  });

  const runEffect = useCallback((...params: Parameters<T>) => {
    callbacks.forEach((callback) => {
      callback.fn(...params);
    });
  }, [callbacks]);

  const run = useCallback((...params: Parameters<T>) => {
    runEffect(...params);
  }, [runEffect]);

  return [useCustomEffectHook, run];
};
