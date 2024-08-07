// 用 JavaScript 写一个函数，输入 int 型，返回整数逆序后的字符串。如：输入
// 整型 1234，返回字符串“4321”。要求必须使用递归函数调用，不能用全局变量，
// 输入函数必须只有一个参数传入，必须返回字符串
function reversed(nums) {
    const R = (nums) => {
        if(nums < 10) return String(nums);
        const res = R(Math.floor(nums / 10));
        return nums % 10 + res;
    }
    return R(nums).replace(/^0/, '');
}
console.log(reversed(45670080));
