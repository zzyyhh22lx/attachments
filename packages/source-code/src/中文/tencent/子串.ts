/**
 * 567. 字符串的排列
 * https://leetcode.cn/problems/permutation-in-string/description/
给你两个字符串 s1 和 s2 ，写一个函数来判断 s2 是否包含 s1 的排列。如果是，返回 true ；否则，返回 false 。
换句话说，s1 的排列之一是 s2 的 子串 。
输入：s1 = "ab" s2 = "eidbaooo"
输出：true
解释：s2 包含 s1 的排列之一 ("ba").
 */
function checkInclusion(s1: string, s2: string): boolean {
    const m = s1.length, n = s2.length;
    if(m > n) return false;
    const S1 = new Array(26).fill(0), S2 = new Array(26).fill(0);
    const a = 'a'.charCodeAt(0);
    for(let i = 0; i < m; i++) {
        ++S1[s1[i].charCodeAt(0) - a];
        ++S2[s2[i].charCodeAt(0) - a];
    }
    if (S1.toString() === S2.toString()) return true;
    for(let i = m; i < n; i++) {
        ++S2[s2[i].charCodeAt(0) - a];
        --S2[s2[i - m].charCodeAt(0) - a];
        if (S1.toString() === S2.toString()) {
            return true;
        }
    }
    return false;
};
