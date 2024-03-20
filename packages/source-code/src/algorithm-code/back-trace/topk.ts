/**
 * 数组中第k大的元素
 * https://leetcode.cn/problems/kth-largest-element-in-an-array/description/?envType=study-plan-v2&envId=top-100-liked
 * 优化快速排序
 * 快排宗旨是选定一个数，比它小的放左边，比它大的放右边
 * @param nums 
 * @param k 
 */
function findKthLargest(nums: number[], k: number): number {
    function gettopk(l, r, k): number {
        if (l >= r) return nums[k];
        let i = l, j = r, f = i;
        // i最大 j最小 f中间
        while(i < j) {
            while(nums[f] <= nums[j] && i < j) j--;
            if (i >= j) break;
            while(nums[i] <= nums[f] && i < j) i++;
            const t = nums[f];
            nums[f] = nums[j];
            nums[j] = nums[i];
            nums[i] = t;
            f = i;
        }
        if (f >= k) return gettopk(l, f, k);
        else return gettopk(f + 1, r, k);
    }
    return gettopk(0, nums.length - 1, nums.length - k);
};