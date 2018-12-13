import Button from './button.js';
import Counter from './counter.js';
import getStore from './eitajs/index.js';

const store = getStore({value: 0});
const counter = Counter('.counter');

store.addMutation((signal, {value}) => ({
  value: signal === 'plus'
    ? value + 1
    : value - 1
}));

store.addPreMutation((signal, {value}) => {
  if (
    (signal === 'plus' && value === 10) ||
    (signal === 'minus' && value === 0)
  ) {
    return 'kill';
  }

  return signal;
});

store.subscribe(counter.render);

Button('.plus', {
  events: {
    click() {
      store.dispatch('plus');
    }
  },
});

Button('.minus', {
  events: {
    click() {
      store.dispatch('minus');
    }
  },
});
