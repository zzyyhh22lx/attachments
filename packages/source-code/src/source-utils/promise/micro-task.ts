/**
 * 运行一个微队列任务
 * 把传递的函数放到微队列中
 * @param {Function} callback
 */
function runMicroTask(callback: any): void {
    if (typeof callback !== 'function') {
        throw TypeError('callback need to be a function!...');
    }
    // 判断node环境
    // 为了避免「变量未定义」的错误，这里最好加上前缀globalThis
    // globalThis是一个关键字，指代全局对象，浏览器环境为window，node环境为global
    if (globalThis.process && globalThis.process.nextTick) { // process node环境
        console.log('走node的process');
        globalThis.process.nextTick(callback);
    } else if (globalThis.MutationObserver) { // MutationObserver 浏览器环境
        console.log('走浏览器的MutationObserver');
      const p = document.createElement("p");
      const observer = new MutationObserver(callback);
      observer.observe(p, {
        childList: true, // 观察该元素内部的变化
      });
      p.innerHTML = "1";
    } else { // Promise
        console.log('走Promise');
        Promise.resolve().then(() => callback);
    }
}

// 使用
setTimeout(()=>{console.log(1)})
runMicroTask(()=>{console.log(3)})
new Promise(resolve => {
    resolve(2)
}).then((data) => {
    console.log(data)
})
console.log(4) // 4 3 2 1