// https://leetcode.cn/problems/longest-increasing-subsequence/description/
// var lengthOfLIS = function(nums) {
//     const len = nums.length;
//     const dp = new Array(len).fill(1); // dp[i]代表位置i时的最长递增子序列长度
//     let max = 1;
//     for(let i = 1; i < len; i++) {
//         const item = nums[i];
//         for(let j = 0; j < i; j++) {
//             if (nums[j] < item) {
//                 dp[i] = Math.max(dp[i], dp[j] + 1);
//             }
//         }
//         max = Math.max(dp[i], max);
//     }
//     return max;
// };

var lengthOfLIS = function(nums) {
    const len = nums.length;
    const dp = new Array(len).fill(1); // dp[i]代表位置i时的最长递增子序列长度
    const prev = new Array(len).fill(-1); // 构建反向追踪得到子序列
    let maxIndex = 0; // 记录最大的索引
    for(let i = 1; i < len; i++) {
        const item = nums[i];
        for(let j = 0; j < i; j++) {
            if (nums[j] < item) {
                if(dp[i] < dp[j] + 1) {
                    dp[i] = dp[j] + 1;
                    prev[i] = j;
                }
            }
        }
        if (dp[i] > dp[maxIndex]) {
            maxIndex = i;
        }
    }
    const lcs = [];
    for(let i = maxIndex; i !== -1; i = prev[i]) {
        lcs.unshift(nums[i]);
    }
    return lcs;
};
lengthOfLIS([0,1,0,3,2,3]) // [0,1,2,3]
/**
 * 怎么理解
 * 此时prev值为[-1, 0, -1, 1, 1, 4]
 * 也就是说，先拿到有交换的最大索引值也就是5, prev[5]也就是4（即子序列取了改值）...
 *  */
