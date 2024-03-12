/**
 * 和为k的子数组
 * https://leetcode.cn/problems/subarray-sum-equals-k/?envType=study-plan-v2&envId=top-100-liked
 * 子数组连续
 * 输入：nums = [1,1,1], k = 2
 * 输出：2
 * @param nums 
 * @param k 
 */
function subarraySum(nums: number[], k: number): number {
    const hashMap = new Map();
    let count = 0, pre = 0;
    hashMap.set(0, 1);
    for(let i = 0; i < nums.length; i++) {
        pre += nums[i];
        if (hashMap.has(pre - k)) {
            count += hashMap.get(pre - k);
        }
        hashMap.set(pre, ~~hashMap.get(pre) + 1);
    }
    return count;
};
