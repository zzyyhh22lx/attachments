/**
 * 大数相加
 * @param {*} a 
 * @param {*} b 
 */
const largeSum = (a, b) => {
    let res = '', c = 0;
    a = a.split('');
    b = b.split('');
    while(a.length || b.length || c) {
        const t = ~~a.pop() + ~~b.pop();
        res = t % 10 + c + res;
        c = t > 9 ? 1 : 0;
    }
    return res;
}

/**
实现斐波那契数列，要求计算数据时可以打印当前过去的时间
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
 */
const T = 8;
let loadTime = 0;
let timer = setInterval(async () => {
    console.log(loadTime += T, 'ms');
}, T);

const delay = (t) => new Promise(res => setTimeout(res, t));

async function fib(n) {
    let dp1 = '0', dp2 = '1';
    let res = n > 1 ? dp2 : dp1;
    let t1 = new Date().getMilliseconds();
    for(let i = 2; i < n; i++) {
        t2 = new Date().getMilliseconds();
        if (t2 - t1 > T) {
            t1 = t2;
            await delay(0);
        }
        dp1 = dp2;
        dp2 = res;
        res = largeSum(dp1, dp2);
    }
    return res;
}
fib(500).then(val => {
    console.log(val);
    clearInterval(timer);
    timer = null;
})
