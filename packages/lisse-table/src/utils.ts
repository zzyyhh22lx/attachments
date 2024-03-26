/**
 * Check whether the parameter is an object
 * @param {*} target The target object
 */
export function isObject(target) {
  return target && typeof target === 'object' && !Array.isArray(target);
}

/**
 * Deeply merge objects
 * @param {object} target The target object
 * @param {object} source The source object
 */
export function mergeDeep(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

/**
 * Control function execution frequency
 * @param {function} fn The target function
 * @param {number} wait The interval of execution of the target function
 * @param {object} opts The context object
 */
export function throttle(fn, wait = 100, opts) {
  // let timer;
  let lastTime;
  return (...arg) => {
    const context = opts || this;
    const currentTime = new Date().getTime();
    const args = arg;
    if (lastTime && currentTime < lastTime + wait) {
      return;
    }
    //   clearTimeout(timer);
    //   timer = setTimeout(() => {
    //     lastTime = currentTime;
    //     fn.apply(context, args);
    //   }, wait);
    // } else {
    lastTime = currentTime;
    fn.apply(context, args);
  };
  // };
}
