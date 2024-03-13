/**
 * 大数相加
 * @param num1 
 * @param num2 
 */
export function bigNumberAdd(a, b) {
    let res = '', c = 0;
    a = a.split('');
    b = b.split('');
    while (a.length || b.length || c) {
/**
~~ 是一个位运算符，用于对操作数进行双重取反。
位运算符会将操作数转换为 32 位有符号整数，然后执行相应的位操作。
对一个字符串形式的数字使用 ~~ 时，它会首先将字符串转换为数字，然后对其进行位操作。
在这个例子中，我们对数字进行了两次取反，因此最终结果仍然是原数字。
使用 ~~ 而不是 Number(): ~~ 通常在处理整数时更快。
当操作数为 undefined 时，~~ 会返回 0，而 Number() 则会返回 NaN。
~~ 只适用于 32 位整数。
 */
      c += ~~a.pop() + ~~b.pop();
      res = c % 10 + res;
      c = c > 9 ? 1 : 0;
    }
    return res.replace(/^0+/, '');
}
