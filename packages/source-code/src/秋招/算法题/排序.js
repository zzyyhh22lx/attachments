// 快排
function quickSort(nums, left = 0, right = nums.length - 1) {
    if (left >= right) return nums;
    let l = left, r = right, j = l;
    while(l < r) {
        // j l r
        // r j l
        while(nums[r] >= nums[j] && r > j) r--;
        if (l >= r) break;
        while(nums[l] <= nums[j] && l < r) l++;
        const temp = nums[j];
        nums[j] = nums[r];
        nums[r] = nums[l];
        nums[l] = temp;
        j = l;
    } 
    quickSort(nums, left, j - 1);
    quickSort(nums, j + 1, right);
    return nums;
}

console.log(quickSort([9, 10, 7, 2, 18, 1]));