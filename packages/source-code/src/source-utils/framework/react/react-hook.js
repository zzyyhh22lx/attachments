let currentHook = 0;
let wipFiber = null;
let wipRoot = null;

function useState(initialValue) {
  const oldHook =
    wipFiber.memoizedState && wipFiber.memoizedState[currentHook];
  const hook = {
    state: oldHook ? oldHook.state : initialValue,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  function setState(action) {
    hook.queue.push(action);
    wipRoot = {
      dom: wipFiber.dom,
      props: wipFiber.props,
      alternate: wipFiber,
    };
    performUnitOfWork(wipRoot);
  }

  wipFiber.memoizedState[currentHook] = hook;
  currentHook++;
  return [hook.state, setState];
}

function performUnitOfWork(fiber) {
  // 更新组件状态
  // ...

  // 创建新的虚拟 DOM 树
  // ...

  // 比较虚拟 DOM 树，计算 DOM 更新操作
  // ...

  // 应用 DOM 更新操作
  // ...
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  currentHook = 0;
  wipFiber.memoizedState = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}
