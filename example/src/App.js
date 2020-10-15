import * as React from "react";
import {EffectControls} from "./EffectControls";
import {EffectFeedback} from "./EffectFeedback";
import {useCustomEffect} from 'use-custom-effect';

const App = () => {
  const [useButtonEffect, runButtonEffect] = useCustomEffect();
  const [useFetchEffect, runFetchEffect] = useCustomEffect();
  const [useRemoveEffect, runRemoveEffect] = useCustomEffect();

  return (
    <div className='app'>
      <EffectControls
        runButtonEffect={runButtonEffect}
        runFetchEffect={runFetchEffect}
        runRemoveEffect={runRemoveEffect}
      />
      <EffectFeedback
        useButtonEffect={useButtonEffect}
        useFetchEffect={useFetchEffect}
        useRemoveEffect={useRemoveEffect}
      />
    </div>
  );
}

export default App;
