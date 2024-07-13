// 在一条直线的公路两旁有n个位置x1，x2,…xn开商店,在位置xi开商店的预期收益为pi，i=1,2,…n.如果任何两个商店之间的距离必须至少为d千米,那么如何选择开设商店的位置使得总收益达到最大?

// dp实现
function maxProfitWithDistanceRestrictionDP(locations, profits, d) {
    // 将位置和收益合并为一个数组，并按照位置进行排序
    let shops = locations.map((location, index) => ({
        location,
        profit: profits[index]
    })).sort((a, b) => a.location - b.location);

    let n = shops.length;
    let dp = new Array(n).fill(0);

    // 初始化动态规划数组
    dp[0] = shops[0].profit;

    // 动态规划求解
    for (let i = 1; i < n; i++) {
        // 不在位置i开店的情况
        dp[i] = dp[i - 1];
        // 找到位置i之前最近的可以开店的位置j
        let j = i - 1;
        while (j >= 0 && shops[i].location - shops[j].location < d) {
            j--;
        }
        // 如果找到了位置j，在位置i开店的情况
        if (j >= 0) {
            dp[i] = Math.max(dp[i], shops[i].profit + dp[j]);
        } else {
            // 如果没有找到位置j，说明位置i是可以开第一个店的位置
            dp[i] = Math.max(dp[i], shops[i].profit);
        }
    }

    // dp数组的最后一个元素包含了最大收益
    return dp[n - 1];
}

let locations = [1, 3, 7, 9, 12];
let profits = [8, 6, 1, 7, 9];
let d = 3;

console.log(maxProfitWithDistanceRestrictionDP(locations, profits, d));
// [3,9,12], 22

/**
 * 思路：dp，和爬楼梯一样
 * 比如[1, 3, 7, 9, 12]
 * dp[i]记录i点最大利润
 * 对于7,上一个可以建筑的地址是3，对于3，最大利润是1而不是3
 */
function getMaxProfit(locations, profits, d) {
    let shops = locations.map((location, index) => ({
        location,
        profit: profits[index]
    })).sort((a, b) => a.location - b.location);

    let n = shops.length;
    let dp = new Array(n).fill(0);
    dp[0] = shops[0].profit;

    for(let i = 1; i < n; i++) {
        dp[i] = dp[i - 1];
        let j = i - 1;
        while(j >= 0 && shops[i].location - shops[j].location < d) j--;
        if (j >= 0) {
            dp[i] = Math.max(dp[i], shops[i].profit + dp[j]);
        } else {
            dp[i] = Math.max(dp[i], shops[i].profit);
        }
    }
    return dp[n - 1];
}