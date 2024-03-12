const sum = (a: number, b: number,c: number, d: number): number => a + b + c + d;
/**
 * 实现 currying(sum, 1, 2, 3, 4) = currying(sum, 1)(2, 3, 4)
 * 函数柯里化
 * @param fn 
 * @param args 
 */
export const currying = (fn: any, ...args: number[]) => {
    if (typeof fn !== 'function') throw new TypeError('curry function must be a function');
    return args.length >= fn.length ? fn(...args) : currying.bind(null, fn, ...args);
}

type Func<T, R> = (...a: T[]) => R;

/**
 * 组合函数(按顺序执行函数)
 * @param fns 
 * @returns 
 */
export const compose = <T, R, S>(...fns: Func<T, R>[]): Func<T, S> => 
    (x: any) => fns.reduce((val, fn) => fn(val), x);

const add = (x: number) => x + 2;
const combineFunc = compose(add, add, add);
combineFunc(2); // 6
