function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function() {
    var self = this, args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); }
      function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); }
      _next(undefined);
    });
  };
}

// 使用生成器和Promise模拟async/await
function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => resolve("Data fetched"), 1000);
  });
}

var fetchAsyncData = _asyncToGenerator(function* () {
  var data = yield fetchData();
  console.log(data);
});

fetchAsyncData();