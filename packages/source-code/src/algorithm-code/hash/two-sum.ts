/**
 * 两数之和
 * https://leetcode.cn/problems/two-sum/?envType=study-plan-v2&envId=top-100-liked
 * 输入：nums = [2,7,11,15], target = 9
 * 输出：[0,1]
 * 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
 * @param nums 
 * @param target 
 */
function twoSum(nums: number[], target: number): number[] {
    const hashMap = new Map();
    for(let i = 0; i < nums.length; i++) {
        const res = hashMap.get(nums[i]);
        if (typeof res === "number") {
            return [res, i];
        }
        hashMap.set(target - nums[i], i);
    }
    return [];
};
