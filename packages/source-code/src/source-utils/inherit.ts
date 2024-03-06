/**
 * 是否是引用类型
 * @param obj 
 * @returns 
 */
export const isObject = (obj: any): boolean => {
    return obj instanceof Object;
}

/**
 * instanceOf
 * @param target 
 * @param fn 
 * @returns 
 */
export const __instanceOf = <T>(target: any, fn: new (...args: any[]) => T): boolean => {
    if (!target) return false;
    return Object.getPrototypeOf(target) === fn.prototype || __instanceOf(Object.getPrototypeOf(target), fn);
}

/** instanceOf重构 */
class Even {
    /** 是否是偶数 */
    static [Symbol.hasInstance](obj: number): boolean {
        return Number(obj) % 2 === 0;
    }
}
const x = new Even();
console.log(x instanceof Even); // false
console.log(2 as any instanceof Even); // true
