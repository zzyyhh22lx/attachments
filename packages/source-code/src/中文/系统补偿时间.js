// 系统补偿时间
// 等待一秒后执行
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function waitNext() {
    await wait(3000)
}
waitNext();
// `setTimeOut`是延时加入宏任务队列中，但执行时机还是会因为单线程而产生时间误差。

//  js 是单线程运行，使用这样的方式强行霸占线程会使得页面进入卡死状态
function timer(time) {
    const startTime = Date.now();
    while(true) {
        const now = Date.now();
        if(now - startTime >= time) {
            console.log('误差', now - startTime - time);
            return;
        }
    }
}
timer(3000);

/**
 * // 系统时间补偿
 * 当每一次定时器执行时后，都去获取系统的时间来进行修正，虽然每次运行可能会有误差，
 * 但是通过系统时间对每次运行的修复，能够让后面每一次时间都得到一个补偿。
 */
// 定时器
//fun 函数
//speed 间隔时间
function __setInterval(func, delay, ...args) {
    let current = Date.now();
    let timeId = null;
    const task = () => {
        current += delay;
        timeId = setTimeout(() => {
            func.apply(this, ...args);
            task();
        }, current - Date.now());
        console.log('系统补偿了' + (delay - current + Date.now()) + 'ms');
    }
    task();
    return () => {
        clearTimeout(timeId);
        timeId = null;
    }
}
const S = __setInterval(() => {}, 1000);
setTimeout(() => {
    S();
}, 10000);