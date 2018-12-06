export default (selector, {events}) => {
  const button = document.querySelector(selector);

  Object.keys(events).forEach(event => {
    button.addEventListener(event, events[event].bind(null, button));
  });
}
