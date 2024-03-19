/**
 * 盛最多水的容器
 * https://leetcode.cn/problems/container-with-most-water/description/?utm_source=LCUS&utm_medium=ip_redirect&utm_campaign=transfer2china
输入：[1,8,6,2,5,4,8,3,7]
输出：49 
解释：图中垂直线代表输入数组 [1,8,9,2,5,4,8,3,7]。在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
 */
function maxArea(height: number[]): number {
    let max = 0;
    let l = 0, r = height.length - 1;
    while(l < r) {
        const currentArea = Math.min(height[r], height[l]) * (r - l);
        max = Math.max(currentArea, max);
        // 移动较短的板子
        // 如果移动高度较大的那个指针，容器的宽度会减小，而高度不会增加，所以水量只会减少不会增加。
        if(height[l] < height[r]) {
            l++;
        } else {
            r--;
        }
    }
    return max;
}

const input = [1, 8, 6, 2, 5, 4, 8, 3, 7];
console.log(maxArea(input)); // 49
