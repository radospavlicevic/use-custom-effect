import {renderHook} from "@testing-library/react-hooks";
import {useCustomEffect} from './';
import {useEffect, useState} from 'react';

describe('useCustomEffect', () => {
  it('Effect consumer basic subscribe', () => {
    const callbackMock = jest.fn();

    const {result} = renderHook(() => useCustomEffect());
    const [useEffectSubscribe, run] = result.current;

    renderHook(() => {
      useEffectSubscribe(callbackMock);
    });

    renderHook(() => {
      useEffect(() => {
        run();
      }, []);
    });

    expect(callbackMock).toHaveBeenCalled();
  });

  it('Effect consumer unsubscribe', () => {
    const callbackMock = jest.fn();
    const {result} = renderHook(() => useCustomEffect());
    const [useEffectSubscribe, run] = result.current;

    const effectConsumer = renderHook(() => {
      useEffectSubscribe(callbackMock);
    });

    const effectProducer = renderHook(({effectTriggerProp}) => {
      useEffect(() => {
        run(effectTriggerProp);
      }, [effectTriggerProp]);
    }, {
      initialProps: {
        effectTriggerProp: 'did-mount',
      },
    });

    expect(callbackMock).toHaveBeenCalledWith('did-mount');

    effectProducer.rerender({effectTriggerProp: 'update-1'});

    expect(callbackMock).toHaveBeenCalledWith('update-1');

    effectConsumer.unmount();

    callbackMock.mockClear();

    effectProducer.rerender({effectTriggerProp: 'update-2'});

    expect(callbackMock).not.toHaveBeenCalled();
  });

  it('Effect consumer with dependency', () => {
    const {result} = renderHook(() => useCustomEffect());
    const [useEffectSubscribe, run] = result.current;

    const effectConsumer = renderHook(() => {
      const [count, setCount] = useState(0);

      useEffectSubscribe(() => {
        setCount(count + 1);
      }, [count]);

      return count;
    });

    const effectProducer = renderHook(({effectTriggerProp}) => {
      useEffect(() => {
        run();
      }, [effectTriggerProp]);
    }, {
      initialProps: {
        effectTriggerProp: 'did-mount',
      },
    });

    expect(effectConsumer.result.current).toBe(1);

    effectProducer.rerender({effectTriggerProp: 'update-1'});

    expect(effectConsumer.result.current).toBe(2);
  });
});
