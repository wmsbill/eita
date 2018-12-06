import Button from './button.js';
import Counter from './counter.js';

const state = {
  value: 0,
};

const counter = Counter('.counter');

Button('.plus', {
  events: {
    click() {
      counter.render(++state.value);
    }
  },
});

Button('.minus', {
  events: {
    click() {
      counter.render(--state.value);
    }
  },
});
