let pending = false;
let resolvedPromise = Promise.resolve();
let queue = [];

function flushQueue() {
  pending = false;
  const copiedQueue = [...queue];
  queue.length = 0; // 清空队列
  for (const job of copiedQueue) {
    job();
  }
}

export function nextTick(fn) {
  // 返回一个 Promise，如果传入了 fn，会在 Promise.then 中调用 fn
  return fn ? resolvedPromise.then(fn) : resolvedPromise;
}

export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
    if (!pending) {
      pending = true;
      resolvedPromise.then(flushQueue);
    }
  }
}