function sleep(delay) {
    return new Promise(res => {
        setTimeout(res, delay);
    })
}
async function log(x) {
    console.log(x);
    return;
}
function PromiseLog() {
    return Promise.resolve().then(() => {
        console.log(2);
    })
}

async function main() {
    await log(1);
    log(2);
}
main();
console.log(3);


// 回调地狱
function fetchData(callback) {
  setTimeout(() => {
    callback(null, "level 1");
    setTimeout(() => {
      callback(null, "level 2");
      setTimeout(() => {
        callback(null, "level 3");
        // 更多嵌套...
      }, 1000);
    }, 1000);
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});