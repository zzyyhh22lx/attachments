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

将所有节点的最短距离估计值初始化为无穷大，除了起点，其最短距离设为0。
设置一个集合或队列来跟踪所有未处理的节点。
选择当前距离最小的未处理节点，将其标记为已处理，这意味着该节点的最短距离已经确定。
更新所有与当前节点相邻的未处理节点的距离估计。如果通过当前节点到达邻居的距离小于已知的最短距离，则更新该邻居节点的最短距离和前驱节点。
重复步骤3和4，直到处理完所有节点。
最终，算法提供了从起点到图中所有其他节点的最短路径和距离。
 * @param {*} graph 
 * @param {*} start 
 * @returns 
 */
function dijkstra(graph, start) {
    const visited = {}; // 是否已访问
    const distances = {};
    const nodes = Object.keys(graph);
    nodes.forEach(node => { // 初始化节点距离
        distances[node] = Infinity;
    })
    distances[start] = 0;
    const unVisited = new Set(nodes); // 存储为访问的节点
    while(unVisited.size > 0) {
        let closestDistance = Infinity, closestNode = null; // 最近距离和最近节点
        unVisited.forEach(node => {
            if (distances[node] < closestDistance) {
                closestDistance = distances[node];
                closestNode = node;
            }
        })
        if (closestNode === null) {
            break; // 所有可达节点都已处理
        }
        // 标记且删除已访问节点
        visited[closestNode] = true;
        unVisited.delete(closestNode);

        const neighbors = graph[closestNode];
        Object.keys(neighbors).forEach(node => {
            if (!visited[node]) {
                distances[node] = Math.min(closestDistance + neighbors[node], distances[node]);
            }
        })
    }
    return { distances };
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
console.log(results.distances); // 打印所有节点到起点的最短距离