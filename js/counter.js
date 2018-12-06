export default selector => {
  const elm = document.querySelector(selector);

  return {
    render(counter) {
      elm.innerText = counter;
    }
  }
}
