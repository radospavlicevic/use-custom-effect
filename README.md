# use-custom-effect

> React hook helper for building custom runtime effects

[![NPM](https://img.shields.io/npm/v/use-custom-effect.svg)](https://www.npmjs.com/package/use-custom-effect) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save use-custom-effect
```

## API

```js
const [useEffectSubscribe, run] = useCustomEffect();
```

- `useEffectSubscribe` - custom generated hook function based on similar API as React [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect) hook:
    ```js
    useEffectSubscribe(callback, deps);
    ```
    - `callback` - function that runs every time when custom effect is triggered
    - `deps` - array of values referenced inside the effect callback function

- `run` - function that triggers the custom effect; every argument passed to `run` function will be passed to `useEffectSubscribe` callback
 
## Usage

**Basic example**

```tsx
import React, {useEffect} from 'react';
import {useCustomEffect} from 'use-custom-effect';

const EffectProducer = ({run, effectTriggerProp}) => {
  useEffect(() => {
    run(effectTriggerProp);
  }, [effectTriggerProp]);

  return null;
}

const EffectConumer = ({useEffectSubscribe}) => {
  useEffectSubscribe((value) => {
    // this code fragment executes every time when EffectProducer useEffect triggers;
    // value - effectTriggerProp passed to run function in EffectProducer
  });

  return null;
}

const App = () => {
  const [useEffectSubscribe, run] = useCustomEffect();

  return (
    <>
      <EffectProducer run={run} effectTriggerProp='Initial value' />
      <EffectConsumer useEffectSubscribe={useEffectSubscribe} />
    </>
  );
};
```

**Fetch example**

```tsx
import React, {useEffect} from 'react';
import {useCustomEffect} from 'use-custom-effect';

const Fetcher = ({runFetchEffect}) => {
  const handleFetch = () => {
    runFetchEffect('START');

    fetch("https://api.com/data")
      .then(res => res.json())
      .then(
        (result) => {
          runFetchEffect('SUCCESS', result);
        },
        (error) => {
          runFetchEffect('ERROR', error);
        }
      );
  };

  return (
    <div>
      <button onClick={handleFetch}>Fetch</button>
    </div>
  );
};

const Consumer = ({useFetchEffect}) => {
  const [fetchCounter, setFetchCounter] = useState(0);
  const [{data, loading, error}, setState] = useState({
    data: null,
    error: null,
    loading: false,
  });

  useFetchEffect((status, response) => {
    if (status === 'START') {
      setFetchCounter(fetchCount + 1);

      setState({
        data: null,
        error: null,
        loading: true,
      });

      return;
    }

    if (status === 'SUCCESS') {
      setState({
        data: response,
        error: null,
        loading: false,
      });

      return;
    }

    if (status === 'ERROR') {
      setState({
        data: null,
        error: response,
        loading: false,
      });

      return;
    }
  }, [fetchCounter, setState, setFetchCounter]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {data && <p>{JSON.stringify(data)}</p>}
      {error && <p>Error: {error}</p>}
      <p>Fetch counter: {fetchCounter}</p>
    </div>
  );
};

const App = () => {
  const [useFetchEffect, run] = useCustomEffect();

  return (
    <>
      <Fetcher runFetchEffect={run} />
      <Consumer useFetchEffect={useFetchEffect} />
    </>
  );
};
```

**Typescript**

[Typescript](https://www.typescriptlang.org/) implementation just includes specifying custom effect callback type:

```ts
const [useEffectSubscribe, run] = useCustomEffect<(id: number, status: string) => void>();
```

#### The benefits of using custom effects

- Reducing props propagation. <br />

  You can resolve custom effect logic in the upper scope, and just delegate custom effect subscribe hook to the effect consumers.
  (There is no need to propagate props which take part into effect).

- Controlling effect execution moment. <br />

  Via `useCustomHook` API, the `run` function is at your disposal that
  executes all effect callbacks synchronously. 

- Using custom effects as a composition unit.

  You can use created custom effect hook to build more complex effects / UI behaviors. 

## License

MIT © [radospavlicevic](https://github.com/radospavlicevic)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
