import * as React from "react";
import {useState} from "react";
import {Section, FetchActions, ButtonActions} from "./utils";

// FEEDBACK HOOKS
const useButtonFeedback = (useButtonEffect) => {
  const [status, setStatus] = useState(null);

  useButtonEffect((action) => {
    setStatus(action);
  });

  return status;
};

const useFetchFeedback = ({useFetchEffect, updateItems}) => {
  const [{status: fetchStatus, response}, setFetchFeedback] = useState({
    status: '',
    response: null,
  });

  useFetchEffect((action, response) => {
    if (action === FetchActions.START) {
      setFetchFeedback({
        status: 'pending',
        response: null,
      });
    } else {
      setFetchFeedback({
        status: action,
        response,
      });
    }
  });

  useFetchEffect((action, response) => {
    if (action === FetchActions.SUCCESS) {
      updateItems(response);
    }
  });

  return {
    fetchStatus,
    response,
  };
};

const useComposedRemoveEffects = ({useRemoveEffect, items, setStatus}) => {
  const handleEdgeCases = (removeIndex) => (callback) => {
    if (items.length === 0) {
      setStatus('NO ITEMS FETCHED');
      return;
    }

    if (isNaN(removeIndex) || removeIndex <= 0 || removeIndex > items.length) {
      setStatus('INVALID INDEX');
      return;
    }

    callback();
  };

  const usePressedEffect = (callback, deps) => {
    useRemoveEffect((action, removeIndex) => {
      if (action !== ButtonActions.PRESSED) {
        return;
      }

      handleEdgeCases(removeIndex)(() => {
        callback(removeIndex);
      });
    }, deps);
  };

  const useReleasedEffect = (callback, deps) => {
    useRemoveEffect((action, removeIndex) => {
      if (action !== ButtonActions.RELEASED) {
        return;
      }

      handleEdgeCases(removeIndex)(() => {
        callback(removeIndex);
      });
    }, deps);
  };

  const useLeaveEffect = (callback, deps) => {
    useRemoveEffect((action) => {
      if (action !== ButtonActions.LEAVE) {
        return;
      }

      callback();
    }, deps);
  };

  return {
    usePressedEffect,
    useReleasedEffect,
    useLeaveEffect,
  };
};

const useRemoveFeedback = ({useRemoveEffect, items, updateItems}) => {
  const [status, setStatus] = useState('');

  const {usePressedEffect, useReleasedEffect, useLeaveEffect} = useComposedRemoveEffects({useRemoveEffect, items, updateItems, setStatus});

  usePressedEffect((validRemoveIndex) => {
    setStatus('WILL REMOVE: ' + validRemoveIndex);

    updateItems(items.map((item, index) => {
      if (index !== validRemoveIndex - 1) {
        return item;
      }

      return {...item, shouldRemove: true};
    }));
  }, [items]);

  useReleasedEffect((validRemoveIndex) => {
    setStatus('DID REMOVE: ' + validRemoveIndex);

    updateItems(items.filter(item => !item.shouldRemove));
  }, [items]);

  useLeaveEffect(() => {
    updateItems(items.map(({id, text}) => ({
      id,
      text,
    })));

    setStatus('');
  }, [items]);

  return status;
};

// HELPER COMPONENTS
const List = ({items}) => {
  const listItems = items || [];

  return (
    <ol className='list'>
      {listItems.map((item) => {
        const itemClasses = item.shouldRemove ? 'item item--shouldRemove' : 'item';

        return <li className={itemClasses} key={item.id}>{item.text}</li>;
      })}
    </ol>
  );
};

const StatusSection = ({title, status}) => (
  <Section title={title}>
    <p>{status ? status.toUpperCase() : ''}</p>
  </Section>
);

export const EffectFeedback = ({useButtonEffect, useFetchEffect, useRemoveEffect}) => {
  const [items, updateItems] = useState([]);
  const buttonStatus = useButtonFeedback(useButtonEffect);
  const {fetchStatus, response} = useFetchFeedback({useFetchEffect, updateItems});
  const removeStatus = useRemoveFeedback({useRemoveEffect, items, updateItems});

  return (
    <div className='demo-panel'>
      <h3>Effect Feedback</h3>
      <StatusSection title='Button status:' status={buttonStatus} />
      <StatusSection title='Fetch status:' status={fetchStatus} />
      <StatusSection title='Remove status:' status={removeStatus} />
      <Section title='Result: '>
        {fetchStatus === FetchActions.ERROR ? response.toString() : (
          <List items={items} />
        )}
      </Section>
    </div>
  );
};
