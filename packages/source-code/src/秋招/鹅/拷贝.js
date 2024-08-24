//  浅拷贝(只能拷贝{}[])
const shallowClone = (object) => {
    if (typeof object !== 'object' || object === null) return object;
    return Array.isArray(object) ? [...object] : { ...object };
}

const deepClone = (object, visited = new WeakMap()) => { // 解决循环引用
    const obj = object.constructor;
    let res;
    if (typeof object !== 'object' || object === null) {
        // function
        if (obj.name === 'Function') {
            if (visited.has(object)) return visited.get(object);
            // 箭头函数(不能被new,没有自己的prototype),这里不能用res.prototype来判断,如果设置了私有属性就有问题比如a=()=>{};a.prototype=1;
            const funcStr = object.toString().trim();
            if (funcStr.includes('=>') && !(funcStr.startsWith('function') || funcStr.startsWith('class'))) {
                res = new Function(`return ${funcStr}`)();
                visited.set(object, res);
                Object.keys(object).forEach((value, key) => {
                    res[key] = deepClone(value, visited);
                })
                return res;
            }
            // 考虑到构造函数和普通对象
            res = function(...args) {
                return object.call(this, ...args);
            }
            visited.set(object, res);
            // 普通对象的自身的属性，比如fn.a = 2这种静态属性
            Object.keys(object).forEach((value, key) => {
                res[key] = deepClone(value, visited);
            })
            // 原型链继承
            res.prototype = Object.create(object.prototype);
            res.prototype.constructor = res;
            return res;
        }
        return object;
    };
    if (visited.has(object)) return visited.get(object);
    // 弱引用对象key值不可遍历
    if (/^(RegExp|Date|WeakMap|WeakSet)/.test(obj.name)) {
        res = new obj(object);
        visited.set(object, res);
        return res;
    }
    if (obj.name === 'Map') {
        res = new Map();
        visited.set(object, res);
        object.forEach((key, value) => {
            res.set(key, deepClone(value, visited));
        });
        return res;
    }
    if (obj.name === 'Set') {
        res = new Set();
        visited.set(object, res);
        object.forEach(value => {
            res.add(deepClone(value, visited));
        })
        return res;
    }
    // Array || Object
    res = Array.isArray(object) ? [] : Object.create(object); // 如果是实例化对象
    visited.set(object, res);
    const props = Object.keys(object);
    const unEnumProps = Object.getOwnPropertyNames(object); // 不可枚举类型
    const symbolProps = Object.getOwnPropertySymbols(object); // symbol属性
    [...props, unEnumProps, ...symbolProps].forEach(key => {
        const { configurable, enumerable, value, writable } = Object.getOwnPropertyDescriptor(object);
        Object.defineProperty(res, key, {
            configurable, enumerable, writable,
            value: deepClone(value, visited)
        })
    });

    visited = null;
    return res;
}
