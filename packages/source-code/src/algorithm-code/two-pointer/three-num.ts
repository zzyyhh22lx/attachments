/**
 * 三数之和
 * https://leetcode.cn/problems/3sum/submissions/426035143/
 * 排序+双指针
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
解释：
nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0 。
nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0 。
不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
注意，输出的顺序和三元组的顺序并不重要。(不重复)
 * @param {number[]} nums
 * @return {number[][]}
 */
export function threeSum(nums: number[]): number[][] {
    nums.sort((a, b) => a - b);
    const res: number[][] = [];
    for(let i = 0; i < nums.length; i++ ){
        if (nums[i] > 0) break;
        if (nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = nums.length - 1;
        while(l < r) {
            const tmp = nums[i] + nums[l] + nums[r];
            if (tmp < 0) {
                l++;
                continue;
            }
            if (tmp > 0) {
                r--
                continue;
            }
            res.push([nums[i], nums[l], nums[r]]);
            // 去重
            while(nums[l] === nums[++l]);
        }
    }
    return res;
}
