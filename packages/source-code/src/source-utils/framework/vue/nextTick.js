let callbacks = [];
let pending = false;

function flushCallbacks () {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// 这里是微任务的polyfill
// 优先级：Promise -> MutationObserver -> setImmediate -> setTimeout
let microTimerFunc;
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve();
  microTimerFunc = () => {
    p.then(flushCallbacks);
    // 在有些情况下，微任务的回调会比事件循环早执行，
    // 所以这里加入一个空的setTimeout来保证回调在事件循环之后执行
    if (isIOS) setTimeout(noop);
  };
} else if (other) { // 其他的回退处理
  // MutationObserver或setImmediate的polyfill
} else {
  // 最后的回退处理是setTimeout
  microTimerFunc = () => {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  let _resolve;
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        // 错误处理
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    microTimerFunc();
  }
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
}