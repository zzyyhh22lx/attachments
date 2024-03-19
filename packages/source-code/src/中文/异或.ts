/**
 * https://leetcode.cn/problems/single-number/submissions/512847455/?envType=study-plan-v2&envId=top-100-liked
只出现一次的数字
给你一个 非空 整数数组 nums ，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。
你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。
输入：nums = [2,2,1]
输出：1
 */
function singleNumber(nums: number[]): number {
    let r = nums[0];
    for(let i = 1; i < nums.length; i++) {
        r ^= nums[i];
    }
    return r;
};
