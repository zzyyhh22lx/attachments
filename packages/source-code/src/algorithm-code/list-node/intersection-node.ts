class ListNode {
    val: number
    next: ListNode | null
    constructor(val?: number, next?: ListNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.next = (next===undefined ? null : next)
    }
}
type HeadNode = ListNode | null;
/**
 * https://leetcode.cn/problems/intersection-of-two-linked-lists/?envType=study-plan-v2&envId=top-100-liked
 * @param headA 
 * @param headB 
 */
function getIntersectionNode(headA: HeadNode, headB: HeadNode): ListNode | null {
    if (!headA || !headB) return null;
    let p1: HeadNode = headA, p2: HeadNode = headB;
    while(p1 !== p2) {
        p1 = p1 === null ? headB : p1.next;
        p2 = p2 === null ? headA : p2.next;
    }
    // 如果不相交且长度一样则此时都为null也可跳出循环
    return p1;
};
