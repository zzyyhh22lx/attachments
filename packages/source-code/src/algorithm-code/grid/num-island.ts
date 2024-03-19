/**
 * 岛屿数量
 * https://leetcode.cn/problems/number-of-islands/submissions/513697747/?envType=study-plan-v2&envId=top-100-liked
 */
function numIslands(grid: string[][]): number {
    let count = 0;
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === '1') {
                grid[i][j] = '0';
                count++;
                dfs(i, j);
            }
        }
    }
    return count;
    /** 递归遍历上下左右节点，有1则置为0 */
    function dfs(i: number, j: number) {
        if (i > 0 && grid[i - 1][j] === '1') {
            grid[i - 1][j] = '0';
            dfs(i - 1, j);
        }
        if (i < grid.length - 1 && grid[i + 1][j] === '1') {
            grid[i + 1][j] = '0';
            dfs(i + 1, j);
        }
        if (j > 0 && grid[i][j - 1] === '1') {
            grid[i][j - 1] = '0';
            dfs(i, j - 1);
        }
        if (j < grid[0].length - 1 && grid[i][j + 1] === '1') {
            grid[i][j + 1] = '0';
            dfs(i, j + 1);
        }
    }
};