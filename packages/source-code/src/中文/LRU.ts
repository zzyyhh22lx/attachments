/**
 * node节点
 * 双向链表
 */
class linkListNode {
    key: any;
    val: any;
    next: linkListNode | null;
    pre: linkListNode | null;
    constructor(key: any, val: any) {
        this.key = key;
        this.val = val;
        this.next = this.pre = null;
    }
}
/**
 * 链表
 */
class linkList {
    head: linkListNode;
    tail: linkListNode;
    constructor() {
        this.head = new linkListNode('head', 'head');
        this.tail = new linkListNode('tail', 'tail');
        this.head.next = this.tail;
        this.tail.pre = this.head;
    }
    /**
     * 往链表头部添加一个节点
     * @param node 
     */
    append(node: linkListNode) {
        const nextNode = this.head.next as linkListNode;
        this.head.next = node;
        node.next = nextNode;
        node.pre = this.head;
        nextNode.pre = node;
    }
    /**
     * 删除链表元素
     * @param node 
     */
    delete(node: linkListNode) {
        const preNode = node.pre as linkListNode;
        const nextNode = node.next as linkListNode;
        preNode.next = nextNode;
        nextNode.pre = preNode;
    }
    /**
     * 删除并返回链表的最后一个节点（非tail）
     */
    pop() {
        const node = this.tail.pre as linkListNode;
        (node.pre as linkListNode).next = this.tail;
        this.tail.pre = node.pre;
        return node;
    }
}
class LRUCache {
    /** 当前长度 */
    currentSize: number;
    size: number;
    linkList: linkList;
    /** 用哈希表来读取node，为什么不直接用哈希，而是用哈希+双向链表？哈希的get set时间复杂度都为常数O(1)，但是delete时需要获取哈希表首位添加的元素即keys().next().value 时间复杂度是线性O(n)可以进行优化 */
    hp: Map<any, linkListNode>;
    constructor(n: number) {
        this.currentSize = 0;
        this.size = n;
        this.linkList = new linkList();
        this.hp = new Map();
    }
    put(key: any, val: any) {
        if (this.hp.has(key)) {
            const node = this.hp.get(key) as linkListNode;
            this.linkList.delete(node);
            this.linkList.append(node);
        } else {
            const node = new linkListNode(key, val);
            this.linkList.append(node);
            this.hp.set(key, node);
            this.currentSize++;
        }
        if (this.currentSize > this.size) {
            const node = this.linkList.pop();
            this.hp.delete(node.key);
            this.currentSize--;
        }
    }
    get(key: any) {
        if (this.hp.has(key)) {
            const node = this.hp.get(key) as linkListNode;
            this.linkList.delete(node);
            this.linkList.append(node);
            return node.val;
        } else {
            return -1;
        }
    }
}

const obj = new LRUCache(2);
obj.put(1, 1);// 1
obj.put(2, 2);// 2 -> 1
console.log(obj.get(1)); // 1 -> 2
obj.put(3, 3);// 3 -> 1
console.log(obj.get(2));// 此时缓存里没有2的位置了，因此会返回-1
obj.put(4, 4);// 4 -> 3
console.log(obj.get(1));// 此时缓存里没有1的位置了，因此会返回-1
console.log(obj.get(3));// 3 -> 4
console.log(obj.get(4));// 4 -> 3
