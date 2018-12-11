import Button from './button.js';
import Counter from './counter.js';
import getStore from './eitajs/index.js';

const store = getStore({value: 0});
const counter = Counter('.counter');

store.addMutation((pulse, {value}) => ({
  value: pulse === 'plus'
    ? value + 1
    : value - 1
}));

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
