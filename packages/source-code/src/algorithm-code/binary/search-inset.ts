/**
 * 二分查找
 * https://leetcode.cn/problems/search-insert-position/description/?envType=study-plan-v2&envId=top-100-liked
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
输入: nums = [1,3,5,6], target = 5
输出: 2
 * @param nums 
 * @param target 
 */
function searchInsert(nums: number[], target: number): number {
    const n = nums.length;
    let l = 0, r = n;
    let mid = 0;
    while (l < r) {
        mid = l + ((r - l) >> 1);
        if (nums[mid] < target) {
            l = mid + 1;
            continue;
        }
        if (nums[mid] > target) {
            r = mid;
            continue;
        }
        return mid;
    }
    return nums[mid] > target ? mid : mid + 1;
};
