/**
 * Map底层实现
 */
class Map {
    constructor() {
      this._data = {};
      this._size = 0;
    }
  
    // 将键和值添加到 Map 中
    set(key, value) {
      const hash = this._hash(key);
      if (!this._data[hash]) {
        this._data[hash] = { key, value };
        this._size++;
      } else if (this._data[hash].key !== key) {
        // 处理哈希冲突
        let node = this._data[hash];
        while (node.next) {
          if (node.next.key === key) {
            node.next.value = value;
            return this;
          }
          node = node.next;
        }
        node.next = { key, value };
        this._size++;
      } else {
        this._data[hash].value = value;
      }
      return this;
    }
  
    // 从 Map 中获取指定键的值
    get(key) {
      const hash = this._hash(key);
      if (!this._data[hash]) {
        return undefined;
      } else if (this._data[hash].key === key) {
        return this._data[hash].value;
      } else {
        let node = this._data[hash];
        while (node.next) {
          if (node.next.key === key) {
            return node.next.value;
          }
          node = node.next;
        }
        return undefined;
      }
    }
  
    // 从 Map 中删除指定键
    delete(key) {
      const hash = this._hash(key);
      if (!this._data[hash]) {
        return false;
      } else if (this._data[hash].key === key) {
        delete this._data[hash];
        this._size--;
        return true;
      } else {
        let node = this._data[hash];
        while (node.next) {
          if (node.next.key === key) {
            node.next = node.next.next;
            this._size--;
            return true;
          }
          node = node.next;
        }
        return false;
      }
    }
  
    // 检查 Map 中是否存在指定键
    has(key) {
      const hash = this._hash(key);
      if (!this._data[hash]) {
        return false;
      } else if (this._data[hash].key === key) {
        return true;
      } else {
        let node = this._data[hash];
        while (node.next) {
          if (node.next.key === key) {
            return true;
          }
          node = node.next;
        }
        return false;
      }
    }
  
    // 返回 Map 中键值对的数量
    size() {
      return this._size;
    }
  
    // 哈希函数
    _hash(key) {
      const hash = typeof key === 'string' ? key : JSON.stringify(key);
      let result = 0;
      for (let i = 0; i < hash.length; i++) {
        result = (result << 5) + result + hash.charCodeAt(i);
        result &= result;
      }
      return result.toString();
    }
}
const a = new Map()
let b = [1,2], g = [1,2], c = [1,3], e = {}, f = function(){}

a.set(b, 1);
a.set(c, 2);
a.set(g, 4);
a.set(e, 3);
console.log(a._data)
// {
//     '4184': { key: {}, value: 3 },
//     '109729383': { key: [ 1, 2 ], value: 1, next: { key: [Array], value: 4 } },
//     '109729416': { key: [ 1, 3 ], value: 2 }
// }

let d = {}
d[b] = 1, d[c] = 2, d[e] = 3, d[f] = 4 // 原对象属性会调用toString方法转为字符串
console.log(d) // { '1,2': 2, '[object Object]': 3, 'function(){}': 4 }