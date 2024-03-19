import { swap } from '../../utils';
// 首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置。
// 再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。
// 重复第二步，直到所有元素均排序完毕。
// 注意：无论什么数据进去都是 O(n²) 的时间复杂度。所以用到它的时候，数据规模越小越好。唯一的好处可能就是不占用额外的内存空间了
// (n-1)+(n-2)+...+1 = n(n-1)/2 ==> 时间复杂度 o(n²)
/**
 * 选择排序
 * @param nums 
 * @returns 
 */
export function selectionSort(nums: number[]): number[] {
    for(let i = 0; i < nums.length - 1; i++) {
        let index = i;
        for(let j = i + 1; j < nums.length; j++) {
            if (nums[index] < nums[j]) {
                index = j;
            }
        }
        swap(nums, i, index);
    }
    return nums;
}
