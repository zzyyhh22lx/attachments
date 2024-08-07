function run(tasks) {
    let promise = Promise.resolve(); // 初始化一个已完成的Promise
    tasks.forEach(task => {
        // 对每个任务进行链式调用
        promise = promise.then(() => {
            return new Promise((resolve, reject) => {
                // 调用原始任务函数，传入resolve作为next回调
                task(resolve);
            });
        });
    });
    return promise; // 返回最终的Promise
}

// 测试代码
console.log(run([
    next => { setTimeout(() => { console.log(1); next() }, 300)},
    next => { setTimeout(() => { console.log(2); next() }, 200)},
    next => { setTimeout(() => { console.log(3); next() }, 100)}
]));