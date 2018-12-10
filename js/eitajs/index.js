const pipe = (...funcs) => funcs.reduce((prev, curr) => curr(prev));

const signal = ([state, pulse]) => function* gen() {
  yield [state, pulse];
}();

const mutate = (mutationList, signal) => async function* () {
  for await (const [state, pulse] of signal) {
    const newState = [...mutationList].reduce((prev, fn) => fn(pulse, prev), state);

    yield [newState, pulse];
  }
}();

const notifyAll = (handlers, signal) => async function* () {
  for await (const [state, pulse] of signal) {
    handlers.forEach(fn => fn(pulse, state));

    yield [state, pulse];
  }
}();

export default (defaultState = {}) => {
  let state = defaultState;
  const listeners = new Set();
  const mutationList = new Set();

  const dispatch = async pulse => {
    const nextStateIterable = await pipe(
      signal([state, pulse]),
      mutate.bind(null, mutationList),
      notifyAll.bind(null, listeners),
    );

    if (listeners.size) {
      const { value } = await nextStateIterable.next();
      [state] = value;
    }

    return state;
  };

  const subscribe = handler => {
    listeners.add(handler);

    return () => {
      listeners.delete(handler);
    }
  };

  const getState = () => ({ ...state });

  const addMutation = fn => void mutationList.add(fn);

  return {
    dispatch,
    subscribe,
    getState,
    addMutation,
  }
};
