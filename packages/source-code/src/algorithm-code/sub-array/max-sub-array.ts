/**
 * 最大子数组和
给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
 * https://leetcode.cn/problems/maximum-subarray/?envType=study-plan-v2&envId=top-100-liked
 * @param nums 
 */
function maxSubArray(nums: number[]): number {
    let max = nums[0];
    let sum = max;
    for(let i = 1; i < nums.length; i++) {
        // const t = (sum < 0 ? 0 : sum) + nums[i];
        // if (t > 0) {
        //     sum = t;
        // } else {
        //     sum = nums[i];
        // }
        // max = Math.max(max, t);
        sum = Math.max(sum + nums[i], nums[i]);
        max = Math.max(max, sum);
    }
    return max;
};
