/**
 * 深拷贝
 */
export const deepClone = (data: Object) => {
    return JSON.parse(JSON.stringify(data));
}

type AnyFunction = (...args: any[]) => any;

/**
 * 防抖节流
 * @param fn 需要防抖的函数
 * @param delay 延迟时间，单位毫秒
 * @param immediate 是否立即执行
 * @returns 返回一个包装过的函数
 */
export function debounce<T extends AnyFunction>(
  fn: T,
  delay: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null;
  if (immediate) {
    // 立即执行，节流，n秒执行一次
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (timer) return;
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, delay);
    } as T;
  } else {
    // 非立即执行，防抖，n秒内重复点击只执行最后一次
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    } as T;
  }
}

