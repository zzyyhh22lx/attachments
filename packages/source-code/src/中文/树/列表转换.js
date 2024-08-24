const data = [
    {
      id: '1',
      name: '父节点1',
      children: [
        {
          id: '1-1',
          name: '子节点1-1',
          children: [
            {
              id: '1-1-1',
              name: '子节点1-1-1'
            },
            {
              id: '1-1-2',
              name: '子节点1-1-2'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: '父节点2',
      children: [
        {
          id: '2-1',
          name: '子节点2-1'
        }
      ]
    }
];
const res = [
    { id: '1', name: '父节点1', parentId: '1' },
    { id: '1-1', name: '子节点1-1', parentId: '1' },
    { id: '1-1-1', name: '子节点1-1-1', parentId: '1-1' },
    { id: '1-1-2', name: '子节点1-1-2', parentId: '1-1' },
    { id: '2', name: '父节点2', parentId: '2' },
    { id: '2-1', name: '子节点2-1', parentId: '2' }
];

// 树型转化为列表
let result = (function(data) {
  return data.reduce(function callee(pre, next) {
    pre.push({
      id: next.id,
      name: next.name,
      parentId: next.parentId ?? next.id
    })
    next.children?.forEach(child => {
      child.parentId = next.id;
      callee(pre, child); // 不要用 arguments.callee，性能不好而且不能优化成尾递归
    })
    return pre;
  }, []);
})(data)
console.log(result);

// // 列表转为树型
result = (function(res) {
    const map = new Map();
    const result = [];
    res.forEach((item) => {
        let element = map.get(item.parentId);
        if(element) {
            element.children = element.children || [];
            element.children.push(item);
        } else {
            // delete item.parentId;
            result.push(item);
        }
        map.set(item.id, item);
    })
    return result;
})(res)

// // 列表转为树型
// result = (function(res) {
//     const map = new Map();
//     const result = [];
//     res.forEach((item) => {
//         let element = map.get(item.parentId);
//         if(element) {
//             element.children = element.children || [];
//             element.children.push(item);
//         } else {
//             // delete item.parentId;
//             result.push(item);
//         }
//         map.set(item.id, item);
//     })
//     return result;
// })(res)
// console.log(result);