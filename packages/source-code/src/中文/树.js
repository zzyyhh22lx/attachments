// 二叉树
// 以链表节点串联为树
class Node {
    constructor(key) {  
        this.val = key
        this.left = null
        this.right = null
    }
}

// 二叉搜索树的定义，值小的节点永远保存在左侧子节点上，值大的节点（包括值相等的情况）永远保存在右侧子节点上。
// 节点的值不可以相同
class BinarySearchTree {
    constructor () {
        // 根节点
        this.root = null, 
        this.depth = 1,
        this.traverse = []
    }

    // 向树中插入一个节点
    insert (key) {
        let newNode = new Node(key)
        if(this.root === null) {
            this.root = newNode
        } else {
            this.insertNode(this.root, newNode)
        }
    }

    // 判断节点位置
    insertNode (node, newNode) {
        if(node.val === newNode.val) {
            // 节点的值不允许相同
            console.log("Fail to insert")
            return
    
        } else if(node.val > newNode.val) {
            if(!node.left) node.left = newNode
            else this.insertNode(node.left, newNode)

        } else {
            if(!node.right) node.right = newNode
            else this.insertNode(node.right, newNode)

        }
    }

    // 遍历树中的所有节点
    outPut (method) {
        switch(method) {
            case "in":
                // 中序
                this.traverse = []
                this.inOrderTraverse(this.root)
                console.log("中序：", this.traverse)
                break
            case "pre":
                // 先序
                this.traverse = []
                this.preOrderTraverse(this.root)
                console.log("先序：", this.traverse)
                break
            case "post":
                // 后序
                this.traverse = []
                this.postOrderTraverse(this.root)
                console.log("后序：", this.traverse.reverse())
                break
            case "min":
                // 返回最小债
                this.min(this.root)
                break
            case "max":
                // 返回最大值
                this.max(this.root)
                break
            case "maxDepth":
                // 返回最大深度
                this.maxDepth(this.root, this.depth)
                console.log(this.depth)
                break
        }
    }

    // 先序遍历方式 ( 根，左，右 )
    preOrderTraverse (node) {
        if(node){
            this.traverse.push(node.val)
            // 递归栈先进后出 
            if(node.left) this.preOrderTraverse(node.left)
            if(node.right) this.preOrderTraverse(node.right)

        } else return
    }
    // 中序遍历 (左 根 右)
    inOrderTraverse (node) {
        if(node){
            // 递归栈先进后出 
            if(node.left) this.inOrderTraverse(node.left)
            this.traverse.push(node.val)
            if(node.right) this.inOrderTraverse(node.right)

        } else return
    }

    // 后序遍历 ( 左，右，根 )
    postOrderTraverse (node) {
        if(node){
            this.traverse.push(node.val)
            // 递归栈先进后出
            if(node.right) this.postOrderTraverse(node.right)
            if(node.left) this.postOrderTraverse(node.left)

        } else return
    }


    // 返回树中的最小节点 (遍历左子树的叶节点)
    min (node) {
        if(!node.left) console.log("min:",node.val)
        else this.min(node.left) // 尾递归
    }

    // 返回树中的最大节点
    max (node) {
        if(!node.right) console.log("max:",node.val)
        else this.max(node.right) // 尾递归
    }
    
    // 查找树的最大深度
    maxDepth (node, depth) {
        if(!node) return 0

        if(depth > this.depth){
            this.depth = depth
        }
        if(!node.left&&!node.right){
            depth = 0
        }

        this.maxDepth(node.left, depth+1)
        this.maxDepth(node.right, depth+1)

        return this.depth

    }

    // 在树中查找一个节点
    search (key) {
        let node = this.root
        while(node){
            if(key === node.val){
                console.log("Can find")
                break
            } else if(key > node.val){
                node = node.right
            } else if(key < node.val){
                node = node.left
            }
        }
        if(!node) console.log("Can not find")
    }
    // 从树中移除一个节点
    remove (key) {}
}

let tree = new BinarySearchTree()
tree.insert(3)
tree.insert(9)
tree.insert(20)
tree.insert(15)
tree.insert(7)
tree.outPut("pre")
tree.outPut("post")
tree.outPut("in")
tree.outPut("min")
tree.outPut("max")
tree.search(12)
tree.outPut("maxDepth")
