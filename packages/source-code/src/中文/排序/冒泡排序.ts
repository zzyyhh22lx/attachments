import { swap } from '../../utils';
// 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
// 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。这步做完后，最后的元素会是最大的数。
// 针对所有的元素重复以上的步骤，除了最后一个。
// 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。
// 时间复杂度 o(n²)
/**
 * 冒泡排序
 * 原地算法
 * @param nums 
 * @returns 
 */
export function bubbleSort(nums: number[]): number[] {
    // 优化 避免重复执行
    let b = true;
    while (b) {
        b = false;
        for (let i = 0; i < nums.length - 1; i++) {
            if (nums[i] > nums[i + 1]) {
                swap(nums, i, i + 1);
                b = true;
            }
        }
    }
    return nums;
}

// 递归实现
function recursion_bubbleSort(nums: number[], isStart: boolean = true): number[] {
    if (!isStart) return nums;
    isStart = false;
    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] > nums[i + 1]) {
            swap(nums, i, i + 1);
            isStart = true;
        }
    }
    return recursion_bubbleSort(nums, isStart);
}

export function sort(nums: number[]): number[] {
    for (let j = 0; j < nums.length; j++) {
        for (let i = 0; i < nums.length - 1; i++) {
            if (nums[i] > nums[i + 1]) {
                swap(nums, i, j);
            }
        }
    }
    return nums;
}

function recursion_sort(nums, j = 0) {
    if (j >= nums.length) return nums;
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] > nums[j]) {
            swap(nums, i, j);
        }
    }
    return recursion_sort(nums, ++j);
}