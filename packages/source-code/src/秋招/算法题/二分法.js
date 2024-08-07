function binary_search(nums, target) {
    const n = nums.length;
    let l = 0, r = n;
    let mid = 0;
    while(l < n) {
        let mid = l + (r - l) >> 1;
        if (nums[mid] > target) {
            l = mid + 1;
            continue;
        }
        if (nums[mid] < target) {
            r = mid;
            continue;
        }
        return mid;
    }
    return -1;
}
console.log(binary_search([1, 7, 10, 16, 20, 29, 30, 80], 20)); // 4