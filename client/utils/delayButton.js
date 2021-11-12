const delayButton = (fn, param, timer) => {
  setTimeout(() => {
    fn(param);
  }, timer);
};

export default delayButton;
