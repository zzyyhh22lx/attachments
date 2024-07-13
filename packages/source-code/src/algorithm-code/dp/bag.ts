/**
 * 背包问题
 *
 * dp[i][j]表示的是j容量时的最大价值
 * i表示对i件物品做出决策，有放入背包和不放入背包俩种决策
 * j代表背包剩余的容量
 * 
 */

// 70 4 (容量+价值)
// 2   32
// 1   15
// 71  100
// 69  20   ----> 47
function takeKnapsack(A, time, num) {
    const dp = new Array(time + 1).fill(0);
    for (let i = 1; i <= num; i++) {
        for (let j = time; j >= 0; j--) {
            const w = A[i - 1][0], v = A[i - 1][1];
            if (j >= w) { // 装的下
                dp[j] = Math.max(dp[j], dp[j - w] + v);
            }
        }
    }
    return dp[time];
}
takeKnapsack([
    [2, 32],
    [1, 15],
    [71, 100],
    [69, 20]
], 70, 4);