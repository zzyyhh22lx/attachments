/**
 * 岛屿数量
 * https://leetcode.cn/problems/number-of-islands/submissions/513697747/?envType=study-plan-v2&envId=top-100-liked
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
此外，你可以假设该网格的四条边均被水包围。
输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3
 */
export function numIslands(grid: string[][]): number {
    let count = 0;
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '1') {
                grid[i][j] === '0';
                count++;
                dfs(i, j);
            }
        }
    }
    return count;
    /** 遍历上下左右,并将陆地(1)置为水(0)标识已走过 */
    function dfs(i: number, j: number) {
        if (i > 0 && grid[i - 1][j] === '1') {
            grid[i - 1][j] = '0';
            dfs(i - 1, j);
        }
        if (j > 0 && grid[i][j - 1] === '1') {
            grid[i][j - 1] = '0';
            dfs(i, j - 1);
        }
        if (i < grid.length - 1 && grid[i + 1][j] === '1') {
            grid[i + 1][j] = '0';
            dfs(i + 1, j);
        }
        if (j < grid[0].length - 1 && grid[i][j + 1] === '1') {
            grid[i][j + 1] = '0';
            dfs(i, j + 1);
        }
    }
};
