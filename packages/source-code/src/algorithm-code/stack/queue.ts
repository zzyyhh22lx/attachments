// Implement the queue using two stacks
/**
 * 使用双栈实现队列
 * 栈(先进后出)拥有的方法：push、pop
 */
class MyQueue {
    private inStack: number[];
    private outStack: number[];
    constructor() {
        this.inStack = [];
        this.outStack = [];
    }

    push(x: number): void {
        this.inStack.push(x);
    }

    pop(): number { // 相当与js的shift方法
        /**
         *     可以理解为翻转数组
         *     const val = this.stack.reverse().pop();
         *     this.stack.reverse();
         *     return val;
         */
        if (this.outStack.length) {
            return this.outStack.pop() as number;
        }
        while(this.inStack.length) {
            this.outStack.push(this.inStack.pop() as number);
        }
        return this.outStack.pop() as number;
    }

    peek(): number {
        return this.outStack.length ? this.outStack[this.outStack.length - 1] : this.inStack[0];
    }

    empty(): boolean {
        return this.inStack.length === 0 && this.outStack.length === 0;
    }
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */
