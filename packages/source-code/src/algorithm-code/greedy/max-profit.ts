/**
 * 买卖股票最佳时期
 * https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/?envType=study-plan-v2&envId=top-100-liked
输入：[7,1,5,3,6,4]
输出：5
解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
     注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。
 * @param prices 
 */
function maxProfit(prices: number[]): number {
    let max = 0, dp = prices[0];
    for(let i = 1; i < prices.length; i++) {
        const p = prices[i];
        if (p > dp) {
            max = Math.max(p - dp, max);
        } else {
            dp = p;
        }
    }
    return max;
};
