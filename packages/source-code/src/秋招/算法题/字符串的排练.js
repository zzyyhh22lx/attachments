// https://leetcode.cn/problems/permutation-in-string/description/
/**
给你两个字符串 s1 和 s2 ，写一个函数来判断 s2 是否包含 s1 的排列。如果是，返回 true ；否则，返回 false 。
换句话说，s1 的排列之一是 s2 的 子串 。

输入：s1 = "ab" s2 = "eidbaooo"
输出：true
解释：s2 包含 s1 的排列之一 ("ba").
 */
var checkInclusion = function(s1, s2) { // d b a o o 每次将记录的前一项剔除即可
    const m = s1.length, n = s2.length;
    if (m > n) return false;
    const cache1 = new Array(26).fill(0), cache2 = new Array(26).fill(0);
    const compareValue = 'a'.charCodeAt();
    for(let i = 0; i < m; i++) {
        cache1[s1[i].charCodeAt() - compareValue]++;
        cache2[s2[i].charCodeAt() - compareValue]++;
    }
    if (cache1.toString() === cache2.toString()) return true;
    for(let i = m; i < n; i++) {
        cache2[s2[i - m].charCodeAt() - compareValue]--;
        cache2[s2[i].charCodeAt() - compareValue]++;
        if (cache1.toString() === cache2.toString()) return true;
    }
    return false;
};