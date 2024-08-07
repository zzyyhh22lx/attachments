/**
 * 最长公共子序列
 * https://leetcode.cn/problems/qJnOS7/submissions/462532602/
 * 
输入：text1 = "abcde", text2 = "ace" 
输出：3  
解释：最长公共子序列是 "ace" ，它的长度为 3 。
 */
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    // dp[i][j]代表该位置下text1[i]和text2[j]下的最长公共子串长度
    const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));

    // 填充 dp 数组
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    // return dp[m][n]

    // 回溯 dp 数组以找出最长公共子序列
    let lcs = '';
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            // 当前字符是最长公共子序列的一部分
            lcs = text1[i - 1] + lcs;
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            // 上移
            i--;
        } else {
            // 左移
            j--;
        }
    }

    return lcs.length;
}
