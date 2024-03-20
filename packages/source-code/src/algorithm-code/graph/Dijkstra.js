/**
Dijkstra算法是一种用于在加权图中找到最短路径的算法
加权图的邻接矩阵
  A B C D E
A 0 6 0 1 0
B 6 0 5 2 2
C 0 5 0 0 5
D 1 2 0 0 1
E 0 2 5 1 0
0表示没有直接的路径，其他数字表示节点之间的距离。 
 * @param {*} graph 
 * @param {*} start 
 * @returns 
 */
function dijkstra(graph, start) {
  const distances = {};
  const visited = {};
  const previous = {};
  const nodes = Object.keys(graph);

  // 初始化所有距离为无穷大，除了起点到起点是0
  nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });
  distances[start] = 0;

  // 遍历所有节点
  while (nodes.length > 0) {
    // 按最短距离排序
    nodes.sort((a, b) => distances[a] - distances[b]);
    const closestNode = nodes.shift(); // 取出最近的节点
    visited[closestNode] = true; // 标记为已访问

    const neighbors = graph[closestNode];
    Object.keys(neighbors).forEach(neighbor => {
      if (!visited[neighbor]) {
        const newDistance = distances[closestNode] + neighbors[neighbor];
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = closestNode;
        }
      }
    });
  }

  return { distances, previous };
}

// 使用邻接列表表示图
const graph = {
  A: { B: 6, D: 1 },
  B: { A: 6, C: 5, D: 2, E: 2 },
  C: { B: 5, E: 5 },
  D: { A: 1, B: 2, E: 1 },
  E: { B: 2, C: 5, D: 1 }
};

const startNode = 'A';
const results = dijkstra(graph, startNode);
console.log(results.distances);
console.log(results.previous);
