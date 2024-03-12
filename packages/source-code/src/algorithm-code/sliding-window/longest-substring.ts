/**
 * 无重复字符的最长子串
 * https://leetcode.cn/problems/longest-substring-without-repeating-characters/?envType=study-plan-v2&envId=top-100-liked
 * 输入: s = "abcabcbb"
 * 输出: 3 
 * 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 * @param s 
 */
function lengthOfLongestSubstring(s: string): number {
    const queue: string[] = []; // unshift pop
    let max = 0;
    for(let i = 0; i < s.length; i++) {
        const index = queue.indexOf(s[i]);
        if (index !== -1) {
            max = Math.max(max, queue.length);
            queue.splice(0, index + 1);
        }
        queue.push(s[i]);
    }
    return Math.max(max, queue.length);
};
