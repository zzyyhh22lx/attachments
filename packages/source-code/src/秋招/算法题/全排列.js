var permute = function(nums) {
    function backtracking(arr, nums) {
        if(arr.length === n) {
            res.push([...arr]);
            return;
        }
        nums.forEach((item, i) => {
            arr.push(item);
            const N = [...nums];
            N.splice(i, 1);
            backtracking(arr, N);
            arr.pop();
        })
    }
    const res = [], n = nums.length;
    backtracking([], nums);
    return res;
};


// 全排列2
// 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。
// 输入：nums = [-1,1,2]
// 可能为负数
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
    function backtacking(string, S, Map) {
        if(string.length >= n) {
            res.push(string.split(','));
            return;
        }
        for(let i = 0; i < S.length; i+=2) {
            let s = '';
            if(S[i] === '-') {
                let negative = S[i] + S[++i];
                string === '' ? s = negative : s = `${string},${negative}`;
            } else string === '' ? s = S[i] : s = `${string},${S[i]}`;
            if(Map.has(s)) continue;
            Map.set(s, 1);
            backtacking(s, sliceStr(S, i), Map);
        }
    }
    function sliceStr(str, i) { // 切割字符串
        if(str[i-1] === '-') return str.slice(0, i-1) + str.slice(i+2);
        return str.slice(0, i) + str.slice(i+2);
    }
    nums = nums.join(',');
    const n = nums.length, res = [];
    backtacking('', nums, new Map());
    return res;
};