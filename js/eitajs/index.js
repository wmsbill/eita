const pipe = (...funcs) => funcs.reduce((prev, curr) => curr(prev));

const signal = (action) => function* gen() {
  yield action;
}();

const mutate = (functionList, entryIterable) => async function* () {
  for await (const item of entryIterable) {
    yield functionList.reduce((prev, fn) => fn(prev), item);
  }
}();

const notifyAll = async (handlers, entryIterable) => {
  for await (const item of entryIterable) {
    handlers.forEach(fn => fn(item));
  }
};

export default (defaultState = {}) => {
  const listeners = new Set();
  const state = defaultState;
  const mutationList = [];

  const dispatch = async (action) => {
    if(listeners.size) {
      await pipe(
        signal(action),
        mutate.bind(null, mutationList),
        notifyAll.bind(null, listeners)
      );
    }
  };

  const subscribe = handler => {
    listeners.add(handler);

    return () => {
      listeners.delete(handler);
    }
  };

  const getState = () => ({ ...state });

  return {
    dispatch,
    subscribe,
    getState,
  }
};
