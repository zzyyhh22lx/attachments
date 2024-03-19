/**
 * 爬楼梯
 * https://leetcode.cn/problems/climbing-stairs/?envType=study-plan-v2&envId=top-100-liked
 * 
输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶

 */
function climbStairs(n: number): number {
    let dp1 = 1, dp2 = 2;
    let max = n > 1 ? 2 : 1;
    for(let i = 3; i <= n; i++) {
        max = dp1 + dp2;
        dp1 = dp2;
        dp2 = max;
    }
    return max;
};
