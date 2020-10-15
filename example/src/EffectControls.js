import * as React from "react";
import {Section, ButtonActions, FetchActions, fetchItems} from "./utils";
import {useRef} from "react";

// HELPER COMPONENTS
const ButtonSection = ({runButtonEffect}) => {
  const onMousePress = () => {
    runButtonEffect(ButtonActions.PRESSED);
  };

  const onMouseReleased = () => {
    runButtonEffect(ButtonActions.RELEASED);
  };

  const onMouseOver = () => {
    runButtonEffect(ButtonActions.ENTER);
  };

  const onMouseLeave = () => {
    runButtonEffect(ButtonActions.LEAVE);
  };

  return (
    <Section title='Button'>
      <button
        onMouseDown={onMousePress}
        onMouseUp={onMouseReleased}
        onMouseEnter={onMouseOver}
        onMouseLeave={onMouseLeave}
        className='button'
      >
        Test me
      </button>
    </Section>
  );
};

const FetchSection = ({runFetchEffect}) => {
  const inputRef = useRef();

  const fetch = () => {
    const size = Number(inputRef.current.value);
    runFetchEffect(FetchActions.START);

    fetchItems(size).then(response => {
      runFetchEffect(FetchActions.SUCCESS, response);
    }).catch(error => {
      runFetchEffect(FetchActions.ERROR, error);
    });
  };

  return (
    <Section title='Fetch'>
      <div className='input-field'>
        <p>Items size (1-20):</p>
        <input ref={inputRef} />
      </div>
      <button className='button' onClick={fetch}>
        Fetch Items
      </button>
    </Section>
  );
};

const RemoveSection = ({runRemoveEffect}) => {
  const inputRef = useRef();

  const handleMouse = (action) => () => {
    const removeIndex = Number(inputRef.current.value);

    runRemoveEffect(action, removeIndex);
  };

  return (
    <Section title='Remove'>
      <div className='input-field'>
        <p>Item index:</p>
        <input ref={inputRef} />
      </div>
      <button
        className='button'
        onMouseDown={handleMouse(ButtonActions.PRESSED)}
        onMouseUp={handleMouse(ButtonActions.RELEASED)}
        onMouseLeave={handleMouse(ButtonActions.LEAVE)}
      >
        Remove Item
      </button>
    </Section>
  );
};

export const EffectControls = ({runButtonEffect, runFetchEffect, runRemoveEffect}) => {
  return (
    <div className='demo-panel'>
      <h3>Effect Controls</h3>
      <ButtonSection runButtonEffect={runButtonEffect} />
      <FetchSection runFetchEffect={runFetchEffect} />
      <RemoveSection runRemoveEffect={runRemoveEffect} />
    </div>
  );
};
