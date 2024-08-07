// 双向链表
class LinkListNode {
    constructor(key, val) {
        this.val = val;
        this.key = key;
        this.pre = null;
        this.next = null;
    }
}

class LinkList {
    constructor() {
        this.head = new LinkListNode('head', 'head');
        this.tail = new LinkListNode('tail', 'tail');
        this.head.next = this.tail;
        this.tail.pre = this.head;
    }
    delete(node) {
        const pre = node.pre;
        const next = node.next;
        pre.next = next;
        next.pre = pre;
    }
    append(node) {
        const next = this.head.next;
        this.head.next = node;
        node.pre = this.head;
        node.next = next;
        next.pre = node;
    }
    pop() {
        const node = this.tail.pre;
        const pre = node.pre;
        pre.next = this.tail;
        this.tail.pre = pre;
        return node;
    }
}

class LRUCache {
    constructor(n) {
        this.size = n;
        this.currentSize = 0;
        this.linkList = new LinkList();
        this.hp = new Map();
    }
    put(key, val) {
        let node;
        if (this.hp.has(key)) {
            node = this.hp.get(key);
            this.linkList.delete(node);
        } else {
            node = new LinkListNode(key, val);
            this.hp.set(key, node);
            this.currentSize++;
        }
        this.linkList.append(node);
        if (this.currentSize > this.size) {
            this.hp.delete(this.linkList.pop().key);
            this.currentSize--;
        }
    }
    get(key) {
        if (this.hp.has(key)) {
            this.put(key, null);
            return this.hp.get(key).val;
        }
        return -1;
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