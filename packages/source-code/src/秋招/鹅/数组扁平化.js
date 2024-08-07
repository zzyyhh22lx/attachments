// 数组扁平化是指将一个多维数组变为一个一维数组
const arr = [1, [2, [3, [4, 5]]]];
let res; // 希望变成 [1, 2, 3, 4, 5]

// 方法一：使用 flat(Infinity)
// Array.prototype.flat(depth) 方法会按照一个可指定的深度(默认为1)递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。
res = arr.flat(Infinity);

// 方法二：利用正则
// 将数组转化为字符串，并替换字符 '[' 和 ']'
res = JSON.stringify(arr).replace(/\[|\]/g, '').split(',').map(item => parseInt(item));

// 方法三：使用 reduce
// 函数式编程
const flatten = arr => {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur)? flatten(cur): cur);
    }, [])
}
res = flatten(arr);

// 方法五：函数递归
function fn(arr) {
    const A = [];
    const func = arr => {
        for(let i = 0; i < arr.length; i++) {
            if(Array.isArray(arr[i])) func(arr[i]);
            else A.push(arr[i]);
        }
    }
    func(arr);
    return A;
}
res = fn(arr);


const _flatten = (arr) => {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? _flatten(cur) : cur);
    }, []);
}
console.log(_flatten(arr));