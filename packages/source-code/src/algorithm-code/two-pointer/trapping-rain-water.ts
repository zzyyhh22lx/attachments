/**
 * 接雨水
 * https://leetcode.cn/problems/trapping-rain-water/description/
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 

思路：左右俩次遍历，当height[r]大于height[l],则计算面积且将l置为r,注意考虑如果height[l]>=height[...r],从右边继续遍历一次实现s
 */
function trap(height: number[]): number {
    let res = 0;
    const indexs: number[] = [];
    let l = 0;
    for(let r = 1; r < height.length; r++) {
        if (height[l] <= height[r]) {
            while(indexs.length) {
                const index = indexs.pop() as number;
                res += height[l] - height[index];
            }
            l = r;
        } else {
           indexs.push(r); 
        }
    }
    indexs.length = 0;
    l = height.length - 1;
    for(let r = l - 1; r >= 0; r--) {
        if (height[l] < height[r]) {
            while(indexs.length) {
                const index = indexs.pop() as number;
                res += height[l] - height[index];
            }
            l = r;
        } else {
           indexs.push(r); 
        }
    }
    return res;
};
