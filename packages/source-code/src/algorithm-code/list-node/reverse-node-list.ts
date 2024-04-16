import type { HeadNode } from '.';
/**
 * Definition for singly-linked list.
 * 反转链表
 * https://leetcode.cn/problems/reverse-linked-list/?envType=study-plan-v2&envId=top-100-liked
 */
export function reverseList(head: HeadNode): HeadNode {
    let pre: HeadNode = null, current = head;
    while(current) {
        const next = current.next;
        current.next = pre;
        pre = current;
        current = next;
    }
    return pre;
};
