import type { HeadNode } from '.';
/**
 * 环形链表
 * 检查链表是否有环
 * 快慢指针
 * https://leetcode.cn/problems/linked-list-cycle/?envType=study-plan-v2&envId=top-100-liked
 * @param head 
 * @returns 
 */
export function hasCycle(head: HeadNode): boolean {
    let fast = head, slow = head;
    while(fast?.next) {
        slow = slow?.next as HeadNode;
        fast = fast.next?.next;
        if (fast === slow) return true;
    }
    return false;
};