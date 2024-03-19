// 使用链表+Map实现
const linkListNode = function (key = "", val = "") {
    this.val = val;
    this.key = key;
    this.pre = null;
    this.next = null;
}

// 设置链表初始状态下节点及它们之间的指向，（生成头节点和尾结点）
const linkList = function () {
    let head = new linkListNode("head", "head");
    let tail = new linkListNode("tail", "tail");
    head.next = tail;
    tail.pre = head;
    this.head = head;
    this.tail = tail;
}

// 链表头节点添加，每次有新元素的时候就添加在头节点处，因此链表元素越靠前，说明元素等级越高
linkList.prototype.append = function (node) {
    node.next = this.head.next;
    node.pre = this.head;
    this.head.next.pre = node;
    this.head.next = node;
}

// 链表删除指定节点
linkList.prototype.delete = function (node) {
    node.pre.next = node.next;
    node.next.pre = node.pre;
}

// 删除并返回链表的最后一个节点（非tail）
// 取到链表的最后一个节点（非tail节点），删除该节点并返回节点信息
linkList.prototype.pop = function () {
    let node = this.tail.pre;
    node.pre.next = this.tail;
    this.tail.pre = node.pre;
    return node;
}

// 打印链表信息
// 将链表的信息按顺序打印出来，入参为需要打印的属性
linkList.prototype.linkConsole = function (key = 'val') {
    let h = this.head;
    let res = "";
    while (h) {
        if (res != "") {
            res += "-->";
            res += h[key];
            h = h.next;
        }
    }
    console.log(res);
}

// LRUCache数据结构
// capacity保存最大容量，kvMap保存节点信息，linkList为节点的顺序链表
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.kvMap = new Map();
        this.linkList = new linkList();
    }
    // put方法
    // 如果关键字key已经存在，则变更其数据值value，并重置节点链表顺序，将该节点移到头节点之后；如果不存在，则向缓存中插入该组key-value。
    // 如果插入操作导致关键字数量超过capacity，则应该踢掉最久未使用的关键字。
    put(key, value) {
        if (this.kvMap.has(key)) {
            let node = this.kvMap.get(key);
            node.val = value;
            this.linkList.delete(node);
            this.linkList.append(node);
        } else {
            let node = new linkListNode(key, value);
            if (this.capacity === this.kvMap.size) {
                let nodeP = this.linkList.pop();
                this.kvMap.delete(nodeP.key);
            }
            this.kvMap.set(key, node);
            this.linkList.append(node);
        }
    }
    // get方法
    // 如果关键字key存在于缓存中，则返回关键字的值，并重置节点链表顺序，将该节点移到头结点之后，否则，返回-1
    get(key) {
        if (!this.kvMap.has(key)) {
            return -1;
        }
        let node = this.kvMap.get(key);
        this.linkList.delete(node);
        this.linkList.append(node);
        return node.val;
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