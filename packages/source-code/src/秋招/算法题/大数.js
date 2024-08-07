const a = 999902, b = 3528999;

// 大数相加
function largeSum(a, b) {
    // let res = '', t = '';
    // let c = 0;
    // const A = a.split(''), B = b.split('');
    // while(A.length || B.length) { // 这里可以用pop而且不用reverse，因为只需要计算一次
    //     const s = ~~A.pop() + ~~B.pop() + c;
    //     res = s % 10 + res;
    //     c = s > 9 ? 1 : 0;
    // }
    // return c > 0 ? 1 + res : res;
    const n = Math.max(a.length, b.length);
    let res = new Array(n + 1).fill(0);
    const A = a.split('').reverse(), B = b.split('').reverse();
    for(let i = 0; i < n; i++) {
        const s = ~~A[i] + ~~B[i];
        const ones = s + res[i];
        res[i] = ones % 10;
        if (ones > 9) {
            res[i + 1] = 1;
        }
    }
    return res.reverse().join('').replace(/^0*/, '');
}
console.log(largeSum(String(a), String(b)), a + b);

// 大数相乘(按平时如何计算乘法方法实现)
function largeMultiple(a, b) {
    if (a === '0' || b === '0') return '0';
    const res = new Array(a.length * b.length).fill(0);
    const A = a.split('').reverse(), B = b.split('').reverse();
    for(let j = 0; j < B.length; j++) {
        for(let i = 0; i < A.length; i++) {
            const m = A[i] * B[j];
            const ones = res[i + j] + m % 10;
            res[i + j] = ones % 10;
            const tens = res[i + j + 1] + Math.floor(m / 10) + Math.floor(ones / 10);
            res[i + j + 1] = tens % 10;
            if (tens > 9) {
                res[i + j + 2] += 1;
            }
        }
    }
    return res.reverse().join('').replace(/^0*/, '');
}
console.log(largeMultiple(String(a), String(b)), a * b);
/**
 9   9   9   2
     7   8   7
 */
