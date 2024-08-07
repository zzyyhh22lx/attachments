/**
https://leetcode.cn/problems/two-sum/
 */
var twoSum = function(nums, target) {
    const hp = new Map();
    const res = [];
    for(let i = 0; i < nums.length; i++) {
        if (hp.has(nums[i])) {
            return [hp.get(nums[i]), i];
        }
        hp.set(target - nums[i], i);
    }
    return res;
};

/**
https://leetcode.cn/problems/3sum/
 */
var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    const n = nums.length;
    // -4 -3 -1 -1 0 1 2 5
    for(let i = 0; i < n; i++) {
        if (nums[i] > 0) break;
        if(nums[i] === nums[i - 1]) continue;
        let l = i + 1, r = n - 1;
        while(l < r) {
            const sum = nums[l] + nums[r] + nums[i];
            if(sum < 0) {l++; continue};
            if(sum > 0) {r--; continue};
            res.push([nums[l], nums[r], nums[i]]);
            while(nums[l] === nums[++l]);
        }
    }
    return res;
};