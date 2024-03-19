/**
 * 有效的括號
 * https://leetcode.cn/problems/valid-parentheses/?envType=study-plan-v2&envId=top-100-liked
输入：s = "()[]{}"
输出：true
 * @param s 
 */
function isValid(s: string): boolean {
    const stack: string[] = [];
    const hp = {
        ')': '(',
        ']': '[',
        '}': '{',
    }
    for(let i = 0; i < s.length; i++) {
        const t = s[i];
        if (t === '(' || t === '[' || t === '{') {
            stack.push(t);
        } else {
            if (!(stack.pop() === hp[t])) {
                return false;
            }
        }
    }
    return stack.length === 0;
};
