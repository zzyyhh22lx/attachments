function* fn() {
  var _n = 12;
  var _v = yield _n + 12; // _v -> yield命令返回值通过后续的next参数决定(没有则为undefined)
  console.log('第二个next后执行')
  yield _v;
  console.log('第2个next后执行')
}
var a = fn();
a.next()
a.next()
console.log(111);
a.next()