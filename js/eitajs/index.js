const pipe = (...funcs) => funcs.reduce((prev, curr) => curr(prev));

const KILL = 'kill';

const pulse = (signal, state) => function* gen() {
  yield [signal, state];
}();

const preMutationHook = (dispatch, hooks, pulse) => function* () {
  for (const [signal, state] of pulse) {
    let newSignal = signal;

    for (const hook of hooks.values()) {
      newSignal = hook(signal, state, dispatch);

      if (newSignal === KILL) {
        break;
      }
    }

    if (newSignal !== KILL) {
      yield [newSignal, state];
    }
  }
}();

const mutate = (mutationList, pulse) => function* () {
  for (const [signal, state] of pulse) {
    const newState = [...mutationList].reduce((prev, fn) => ({
      ...prev,
      ...fn(signal, state),
    }), state);

    yield [signal, newState];
  }
}();

const notifyAll = (handlers, pulse) => function* () {
  for (const [signal, state] of pulse) {
    handlers.forEach(fn => fn(state, signal));

    yield [signal, state];
  }
}();

export default (defaultState = {}) => {
  let state = defaultState;
  const updateState = (newState) => { state = newState; };
  const listeners = new Set([updateState]);
  const mutationList = new Set();
  const preMutationList = new Set();

  const dispatch = signal => {
    const nextStateIterable = pipe(
      pulse(signal, state),
      preMutationHook.bind(null, dispatch, preMutationList),
      mutate.bind(null, mutationList),
      notifyAll.bind(null, listeners),
    );

    if (listeners.size > 1) {
      nextStateIterable.next();
    }
  };

  const subscribe = handler => {
    listeners.add(handler);

    return () => {
      listeners.delete(handler);
    }
  };

  const getState = () => ({ ...state });

  const addMutation = fn => void mutationList.add(fn);

  const addPreMutation = fn => void preMutationList.add(fn);

  return {
    dispatch,
    subscribe,
    getState,
    addMutation,
    addPreMutation,
  };
};
