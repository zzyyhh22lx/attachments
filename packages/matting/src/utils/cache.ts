/**
  * LRU缓存(默认最多缓存15条撤销记录) 超过的将最开始的去掉
  */
export class HistoryCache<T> {
  size: number;
  cacheMap: T[];
  cache: T[];

  /**
   * 缓存 &{n} 条数据
   * @param n 默认15
   */
  constructor(n: number = 15) {
    this.size = n;
    this.cacheMap = [];
    this.cache = [];
  }

  length(): number {
    return this.cacheMap.length;
  }

  push(area: T): void {
    if (this.cacheMap.length >= this.size) {
      this.cacheMap.shift();
    }
    this.cacheMap.push(area);
  }

  get(): T | undefined {
    return this.cacheMap[this.length() - 1];
  }

  pop(): T | undefined {
    if (this.cache.length >= this.size) {
      this.cache.shift();
    }
    const area = this.cacheMap.pop();
    if (area !== undefined) {
      this.cache.push(area);
    }
    return area;
  }
}
