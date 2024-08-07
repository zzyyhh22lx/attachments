/**
 * 大数相加
 * @param {*} a 
 * @param {*} b 
 */
const largeSum = (a, b) => {
    let res = '', t = '';
    let c = 0;
    const A = a.split(''), B = b.split('');
    while(A.length || B.length) {
        const s = ~~A.pop() + ~~B.pop() + c;
        res = s % 10 + res;
        c = s > 9 ? 1 : 0;
    }
    return c > 0 ? 1 + res : res;
}
const a = 999902, b = 3528999;
console.log(largeSum(String(a), String(b)), a + b);

/**
 * 大数相乘
 * @param {*} a 
 * @param {*} b 
 */
const largeMultiple = (a, b) => {
    if (a === '0' || b === '0') return '0';
    let res = new Array(a.length * b.length).fill(0);
    a = a.split('').reverse();
    b = b.split('').reverse();
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < b.length; j++) {
            const t = a[i] * b[j] + res[i + j];
            res[i + j] = t % 10;
            res[i + j + 1] += Math.floor(t / 10);
        }
    }
    return res.reverse().join('').replace(/^0*/g, '');
}
console.log(largeMultiple(String(a), String(b)), a * b);
// 999*875
// 
// 