// map实现

// 页面置换算法，选择最近最久未使用的页面予以淘汰。
// LRU算法通常用于缓存淘汰策略，主要思想是根据最近的访问时间来判断一个缓存项是否需要被替换，即最近最少使用的缓存项优先被淘汰。

// 实现浏览器最近浏览记录的存储

/*
    当缓存已满时，插入新的数据，这时需要淘汰最近最少使用的数据，即最久没有被访问的数据。
    当插入一个已存在的数据时，将它移动到队列的末尾。

    对于delete操作，只有通过遍历整个Map，才能获取要删除的元素。
    因此delete方法的时间复杂度并不是O(1)。这里就是我们可以优化的点。
*/
export class LRUCache {
    constructor(n) {
        this.size = n // 初始化最大缓存数据条为n
        this.cacheMap = new Map() // 初始化缓存空间map
    }
    put(domain, info) {
        if(this.cacheMap.has(domain)) {
            // 已存在需更新数据的位置
            this.cacheMap.delete(domain); //移除数据
        }
        if(this.cacheMap.size >= this.size) {
            // 删除最不常用数据(Map.keys()返回一个迭代器 function* )
            const firstKey = this.cacheMap.keys().next().value; // 不必当心cacheMap为空，因为this.size一般不为空
            this.cacheMap.delete(firstKey);
        }
        this.cacheMap.set(domain, info); // 在末尾重新插入数据
    }
    get(domain) {
        if(!this.cacheMap.has(domain)) return false;
        const info = this.cacheMap.get(domain); // 获取结果
        this.cacheMap.delete(domain); // 移除数据
        this.cacheMap.set(domain, info); // 在末尾重新插入数据
        return info; 
    }
}
