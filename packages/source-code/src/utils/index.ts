/**
 * 交换函数
 * @param nums 
 * @param i 
 * @param j 
 */
export function swap(nums: number[], i: number, j: number): void {
    const temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
