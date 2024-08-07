// https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/description/
var maxProfit = function(prices) {
    const n = prices.length;
    let min = prices[0], max = 0;
    for(let i = 1; i < n; i++) {
        const item = prices[i];
        max = Math.max(max, item - min);
        min = Math.min(min, item);
    }
    return max;
};


// 买卖股票的最佳时机2
/**
https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/
[7,1,5,3,6,4]
3 - 5 < 0 即可买入即nums[i] < nums[i-1]
 */
var maxProfit = function(prices) {
    const n = prices.length;
    let min = prices[0]; // p[i] < p[i-1]
    let dp = 0, max = 0;
    for(let i = 1; i < n; i++) {
        const item = prices[i];
        dp = Math.max(dp, item - min);
        if (item < prices[i - 1]) {
            min = item;
            max += dp;
            dp = 0;
        }
    }
    return dp + max;
};