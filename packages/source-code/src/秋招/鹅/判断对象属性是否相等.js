const a = {
    a: {
        c: 1,
        b: '2'
    },
    c: {
        a: [1, 2, {
            a: 'x'
        }],
    }
};
const b = {
    a: {
        c: 1,
        b: '2'
    },
    c: {
        a: [1, 2, {
            a: 'x'
        }],
    }
}
a.c.b = a.c;
b.c.b = b.a;
const isObject = (object) => {
    return typeof object === 'object' && object !== null;
}
const isEqualObjects = (object1, object2, visited = new WeakMap()) => { // 对象key值不可能是object
    let index = 1;
    if (visited.has(object1) && visited.has(object2)) {
        const vo1 = visited.get(object1), vo2 = visited.get(object2);
        if (vo1 !== vo2) return false;
        index = 2;
        if (vo2 === 2) return true;
    }
    if ((visited.has(object1) && !visited.has(object2)) || (visited.has(object2) && !visited.has(object1))) return false;
    if ((isObject(object1) && !isObject(object2)) || (isObject(object2) && !isObject(object1))) return false;
    if (!isObject(object1) && !isObject(object2)) return object1 === object2;

    visited.set(object1, index), visited.set(object2, index);
    const props1 = Object.keys(object1), props2 = Object.keys(object2);
    if (props1.length !== props2.length) return false;
    const unEnumProps1 = Object.getOwnPropertyNames(object1), unEnumProps2 = Object.getOwnPropertyNames(object2);
    if (unEnumProps1.length !== unEnumProps2.length) return false;
    const symbolProps1 = Object.getOwnPropertySymbols(object1), symbolProps2 = Object.getOwnPropertySymbols(object2);
    if (symbolProps1.length !== symbolProps2.length) return false;
    const allProps1 = [...props1, ...unEnumProps1, ...symbolProps1], allProps2 = [...props2, ...unEnumProps2, ...symbolProps2];
    for(let i = 0; i < allProps1.length; i++) {
        const key = allProps1[i];
        if (!allProps2.includes(key)) return false;
        const value1 = object1[key], value2 = object2[key];
        if (!isEqualObjects(value1, value2, visited)) return false;
    }
    return true;
}
console.log(isEqualObjects(a, b));