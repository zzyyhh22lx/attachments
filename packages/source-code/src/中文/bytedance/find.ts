/**
 * 小于N的最大数字
 * 给定一个数组[2,3,4,5]，组成一个不大于N的最小数字
 * N = 3365 => 3345
 * 数组的数字可以重复使用
 * 
 * 回溯，先排序，记录flag代表是选择前一位选择的是小于的数(后面直接选择最大)还是等于的数
 * 需要处理特殊情况,如[2,3,4] 134 => 44, 返回最大的数字(少一位) 431 => 424
 * @param nums 
 */
const find = (nums: number[], N: number): number => {
    const N_nums = String(N).split('').map(i => ~~i);
    /** 倒序 */
    nums.sort((a, b) => a - b);
    const max = nums[nums.length - 1];
    const res: number[] = [];
    dfs(0, false, false);
    return ~~res.join('');
    /**
     * 
     * @param index N索引值
     * @param flag 代表是选择前一位选择的是小于的数(后面直接选择最大)还是等于的数
     * @param isBack 是否是重新回溯来的(此时需要选择比之前小的数而不能是相等的数)
     */
    function dfs(index: number, flag: boolean, isBack: boolean) {
        // 说明第一位比nums所有数都小
        if (index < 0) {
            return res.push(...String(max).repeat(N_nums.length - 1).split('').map(item => ~~item));
        }
        if (res.length >= N_nums.length) return;
        if (flag) {
            res.push(max);
            dfs(++index, true, false);
            return;
        }
        const N_t = N_nums[index];
        for(let i = 0; i < nums.length; i++) {
            const t = nums[i];
            if (t === N_t && !isBack) {
                res.push(t);
                return dfs(++index, false, false);
            }
            if (t < N_t && ~~nums[i + 1] >= N_t && isBack) {
                res.push(t);
                return dfs(++index, true, false);
            }
            if (t < N_t && ~~nums[i + 1] > N_t) {
                res.push(t);
                return dfs(++index, true, false);
            }
            if (i === nums.length - 1) {
                res.push(nums[i]);
                return dfs(++index, true, false);
            }
            if (t > N_t) {
                res.pop();
                return dfs(--index, false, true);
            }
        }
    }
}
console.log(find([2,3,4,6,7,9,0], 165931));
