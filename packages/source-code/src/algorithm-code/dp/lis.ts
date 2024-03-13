/**
 * 最长递增子序列
 * 输入：nums = [10,9,2,5,3,7,101,18]
 * 输出：4
 * 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
 */
function lengthOfLIS(nums: number[]): number {
    const dp = new Array(nums.length).fill(1);
    let max = 1;
    for(let i = 1; i < nums.length; i++) {
        for(let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) dp[i] = Math.max(dp[j] + 1, dp[i]);
        }
        max = Math.max(max, dp[i]);
    }
    return max;
};
