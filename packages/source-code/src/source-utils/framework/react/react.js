let currentFiber = null;
let hookIndex = null;

function useState(initialValue) {
  const oldHook = currentFiber.memoizedState[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initialValue,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = action instanceof Function ? action(hook.state) : action;
  });

  const setState = action => {
    hook.queue.push(action);
    scheduleUpdate(currentFiber);
  };

  currentFiber.memoizedState[hookIndex++] = hook;
  return [hook.state, setState];
}

function scheduleUpdate(fiber) {
  // 模拟调度更新
}

function workLoop(fiber) {
  // 模拟工作循环
  hookIndex = 0;
  currentFiber = fiber;
  // ...执行组件函数，处理钩子逻辑等
}

// 示例使用
function App() {
  const [count, setCount] = useState(0);
  // ...
}