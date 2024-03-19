function __resolve(prom: any): Promise<any> {
    // 如果已经是 Promise 对象，则直接返回该 Promise 对象
    if (prom instanceof Promise) {
        return prom;
    }
    // 如果是 thenable 对象，则包装成 Promise 对象并返回
    if (prom && typeof prom.then === 'function') {
        return new Promise((res, rej) => {
            prom.then(res, rej);
        })
    }
    return new Promise(res => {
        res(prom);
    })
}

function __reject(reason: any) {
    return new Promise((_, rej) => {
        rej(reason);
    })
}

/**
 * 语法糖
 * 本质就是then，只是少传了一个onFulfilled
 * 所以仅处理失败的场景
 * @param {*} param 
 */
Promise.prototype.catch = function (fn) {
    console.log('捕获promise错误');
    return this.then(null,fn);
}

/**
  * 无论成功还是失败都会执行回调
  * @param {Function} onSettled
  */
Promise.prototype.finally = function (onSettled: (() => void) | null | undefined) {
    return this.then(
      (data) => {
        typeof onSettled === 'function' && onSettled(); // 实现了收不到参数了
        return data; // 这里返回之前resolve的结果
      },
      (reason) => {
        typeof onSettled === 'function' && onSettled();
        throw reason;
      }
    );
    // finally函数 返回结果应该是无效的
}

__resolve('value').then((res) => {
    console.log(`then捕获${res}1`);
    return __reject('error');
}).then((res) => res).then((res) => {
    console.log(`then捕获${res}2`);
}).finally(() => {
    console.log('finally');
}).catch(e => {
    console.log(e);
})
// 捕获promise错误
// then捕获value1
// finally
// error

// 为什么会先走"捕获promise错误"，因为链式调用会直接执行(同步代码)