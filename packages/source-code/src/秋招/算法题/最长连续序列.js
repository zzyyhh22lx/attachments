/**
https://leetcode.cn/problems/WhsWhI/
 */
var longestConsecutive = function(nums) {
    const st = new Set();
    for(let i = 0; i < nums.length; i++) {
        st.add(nums[i]);
    }
    let max = 0;
    for(let i = 0; i < nums.length; i++) {
        let item = nums[i];
        let inMax = 1;
        if (!st.has(item - 1)) { // 取最小即可
            while(st.has(++item)) {
                inMax++;
            }
        }
        max = Math.max(max, inMax);
    }
    return max;
};
