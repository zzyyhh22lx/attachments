import { swap } from '../../utils';

/**
 Do not return anything, modify nums in-place instead.
 移动0：给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
 https://leetcode.cn/problems/move-zeroes/description/?envType=study-plan-v2&envId=top-100-liked
 输入: nums = [0,1,0,3,12]
 输出: [1,3,12,0,0]
 */
export function moveZeroes(nums: number[]): void { // 取巧
    const n = nums.length;
    let index = 0;
    for(let i = 0; i < n - index; i++) {
        if (nums[i] === 0) {
            nums.splice(i--, 1);
            nums.push(0);
            index++;
        }
    }
};

/**
 * 双指针实现
 * @param nums
 * 0 2 4 0
 * 2 2 4 0
 * 2 4 4 0
 * 2 4 0 0
 */
export function mZ(nums: number[]): void {
    let j = 0;
    const n = nums.length;
    for(let i = 0; i < n; i++) {
        if (nums[i] !== 0) nums[j++] = nums[i];
    }
    for(let i = j; i < n; i++) {
        nums[j] = 0;
    }
};

/**
 * 优化
 * @param nums 
 */
export function optimizeMZ(nums: number[]): void {
    const n = nums.length;
    for(let i = 0, j = 0; i < n; i++) {
        if (nums[i] !== 0) {
            swap(nums, i, j++);
        }
    }
};
