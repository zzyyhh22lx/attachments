/**
 * 根据Promise A+规范,promise有三个状态(pending,fullfilled,rejected),一旦最终态改变则无法更改
 * then返回的是promise, 且原promise的状态会与新promise的状态保持一致,即我们可以在then返回一个新的保持pending状态的promise
 * 
 * 中断promise，也就是在then将返回值新promise保持状态为pending
 * 那么这个promise的链也会中断（等待）
 */
let bool = false;
Promise.resolve('哈哈哈哈哈我没有被中断...').then((val) => {
    if(bool) return new Promise((resolve, reject) => {});
    return val;
}).then((val) => {
    console.log(val)
})
bool = true;

(async () => {
    const P = Promise.resolve(1).then(() => 't');
    console.log(await P); // t
})()