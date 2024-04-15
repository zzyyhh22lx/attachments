/**
  * 得到一个新的Promise，该Promise的状态取决于proms的执行
  * proms是一个迭代器，包含多个Promise
  * 全部Promise成功，返回的Promise才成功，数据为所有Primsise成功的数据，并且顺序时按照传入的顺序排列
  * 只要有一个Promise失败，则=返回的Pormise失败，原因是第一个Promise失败的原因
  * @param {iterator} proms
  */
function promiseAll(proms: any[]): Promise<any[] | PromiseRejectedResult> {
    const res = new Array(proms.length);
    let resolvedCount = 0;
    let isRejected = false;
    return new Promise((resolve, reject) => {
        proms.forEach((prom, index) => {
            Promise.resolve(prom).then(value => {
                if (isRejected) return;
                res[index] = value;
                resolvedCount++;
                if (resolvedCount === proms.length) {
                    resolve(res);
                }
            }).catch(error => {
                if (!isRejected) {
                    isRejected = true;
                    reject(error);
                }
            });
        });
    });
}

promiseAll([
    new Promise(res => {
        const val = 3;
        setTimeout(() => {
            console.log(`2${val}`);
            res(val);
        });
    }),
    Promise.resolve(2).then(val => {
        console.log(`1${val}`);
        return val;
    }),
    Promise.reject(2),
    new Promise(res => res(1)).then(val => {
        console.log(`0${val}`);
        return val;
    }),
]).then(val => {
    console.log(val);
}).catch(e => {
    console.log('错误', e);
})
// 12
// 01
// 23
// [ 3, 2, 1 ]