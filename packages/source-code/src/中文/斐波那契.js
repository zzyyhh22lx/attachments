/**
实现斐波那契数列，要求计算数据时可以打印当前过去的时间
F(0) = 0，F(1) = 1
F(n) = F(n - 1) + F(n - 2)，其中 n > 1
 */
const T = 50;
let loadTime = 0;
let timer = setInterval(async () => {
    console.log(loadTime += T)
}, T);

async function fib(n) {
    let dp1 = 0, dp2 = 1;
    let res = n > 1 ? dp2 : dp1;
    for(let i = 2; i < n; i++) {
        dp1 = dp2;
        dp2 = res;
        res = dp1 + dp2;
    }
    return res;
}
fib(100).then(val => {
    console.log(val);
    clearInterval(timer);
    timer = null;
})

console.log(fib(100))