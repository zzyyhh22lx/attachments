/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 * https://leetcode.cn/problems/merge-two-sorted-lists/
 */
var mergeTwoLists = function(list1, list2) {
    if(!list1) {
        return list2;
    } else if(!list2) {
        return list1;
    } else if(list1.val < list2.val) {
        list1.next = mergeTwoLists(list1.next, list2)
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
};

var mergeTwoLists = function(list1, list2) {
    const pre = new ListNode(-1, null);
    let p = pre;
    while(list1 && list2) {
        if(list1.val <= list2.val) {
            p.next = list1;
            list1 = list1.next;
        } else {
            p.next = list2;
            list2 = list2.next;
        }
        p = p.next;
    }
    if (!list1) {
        p.next = list2;
    }
    if(!list2) {
        p.next = list1;
    }
    return pre.next;
};