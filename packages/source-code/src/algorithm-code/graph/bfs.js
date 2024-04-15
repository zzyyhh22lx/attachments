function bfsMazeSolver(maze) {
  const rows = maze.length;
  const cols = maze[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [];
  const directions = [
    [1, 0], // 下
    [0, 1], // 右
    [-1, 0], // 上
    [0, -1], // 左
  ];
  
  // 节点类，用于存储当前位置和从起点到当前位置的路径
  class Node {
    constructor(x, y, path) {
      this.x = x;
      this.y = y;
      this.path = path;
    }
  }

  // 将起点加入队列
  queue.push(new Node(0, 0, [[0, 0]]));
  visited[0][0] = true;

  // BFS
  while (queue.length > 0) {
    const current = queue.shift();
    const x = current.x;
    const y = current.y;
    const path = current.path;
    
    // 如果到达终点
    if (x === rows - 1 && y === cols - 1) {
      return path;
    }

    // 遍历所有可能的移动方向
    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      // 检查新位置是否在迷宫范围内，是否可走，以及是否已访问过
      if (newX >= 0 && newX < rows && newY >= 0 && newY < cols && maze[newX][newY] === 0 && !visited[newX][newY]) {
        visited[newX][newY] = true;
        // 这里的newX应该是写错了
        queue.push(new Node(newX, newY, path.concat([[newX, newY]])));
      }
    }
  }

  // 如果队列为空，说明没有找到路径
  return null;
}

// 示例迷宫，0 表示通路，1 表示墙壁
const maze = [
  [0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
];

const shortestPath = bfsMazeSolver(maze);
console.log(shortestPath); // 打印最短路径
