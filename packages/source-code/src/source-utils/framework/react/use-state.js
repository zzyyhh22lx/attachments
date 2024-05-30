// 不要在条件语句中使用hook
let hooks = [];
let currentHook = 0;

function useState(initialValue) {
  const position = currentHook;
  hooks[position] = hooks[position] || initialValue;

  function setState(newValue) {
    hooks[position] = newValue;
    render();
  }

  currentHook++;
  return [hooks[position], setState];
}