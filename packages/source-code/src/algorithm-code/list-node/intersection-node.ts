import type { HeadNode } from '.';
/**
   相交链表
   检查链表是否相交
   https://leetcode.cn/problems/3u1WK4/
   并非快慢指针，如果相交，则只需要O(m+n)时间复杂度
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
const getIntersectionNode = function(headA: HeadNode, headB: HeadNode): HeadNode {
    let h1 = headA, h2 = headB;
    while(h1 !== h2) {
        h1 = h1? h1.next : headB;
        h2 = h2 ? h2.next : headA;
    }
    return h1;
};
