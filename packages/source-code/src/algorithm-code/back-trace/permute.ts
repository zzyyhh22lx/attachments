/**
 * 全排列
 * https://leetcode.cn/problems/permutations/?envType=study-plan-v2&envId=top-100-liked
输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 * @param nums 
 */
function permute(nums: number[]): number[][] {
    const res: number[][] = [];
    const n = nums.length;
    const path: number[] = [];
    function backtrace(used: boolean[]): void {
        if (path.length >= n) {
            res.push([...path]);
            return;
        }
        for(let i = 0; i < n; i++) {
            if (used[i]) continue;
            path.push(nums[i]);
            // 同支
            used[i] = true;
            backtrace(used);
            path.pop();
            used[i] = false;
        }
    }
    backtrace(new Array(n).fill(false));
    return res;
};
