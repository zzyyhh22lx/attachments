/**
 * 快速排序
 * 中间数，比它小的放左边，比它大的放右边
 * @param nums 
 */
const quickSort = (nums: number[]) => {
    let left = 0, right = nums.length - 1;
    const stack = [[left, right]];
    while (stack.length > 0) {
        const item = stack.pop() as number[];
        // i最大，j最小 flag中间
        let i = item[0], j = item[1], flag = i;
        if (i >= j) continue;
        while (i < j) {
            while (nums[j] >= nums[flag] && j > flag) j--;
            if (i >= j) break;
            while (nums[i] <= nums[flag] && i < j) i++;
            const temp = nums[flag];
            nums[flag] = nums[j];
            nums[j] = nums[i];
            nums[i] = temp;
            flag = i;
        }
        stack.push([item[0], flag - 1]);
        stack.push([flag + 1, item[1]]);
    }
    return nums;
}

function recursion_quickSort(nums, left = 0, right = nums.length - 1) {
    if (left >= right) return nums;
    let i = left, j = right, flag = left;
    //索引 flag i    j
    //值   j    flag i
    while (i < j) {
        while (nums[j] >= nums[flag] && j > flag) j--;
        if (i >= j) break;
        while (nums[i] <= nums[flag] && i < j) i++;
        const temp = nums[i];
        nums[i] = nums[j]
        nums[j] = nums[flag];
        nums[flag] = temp;
        flag = i;
    }
    recursion_quickSort(nums, left, flag - 1);
    recursion_quickSort(nums, flag + 1, right);
    return nums;
}
