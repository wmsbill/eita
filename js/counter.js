export default selector => {
  const elm = document.querySelector(selector);

  return {
    render({value}) {
      elm.innerText = value;
    }
  }
}
