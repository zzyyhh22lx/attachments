/**
 * 矩阵置零
 * https://leetcode.cn/problems/set-matrix-zeroes/?envType=study-plan-v2&envId=top-100-liked
 * 给定一个 m x n 的矩阵，如果一个元素为 0 ，则将其所在行和列的所有元素都设为 0 。请使用 原地 算法。
 Do not return anything, modify matrix in-place instead.
 */
 function setZeroes(matrix: number[][]): void {
    // i, j 标记
    const a = new Array(matrix[0].length);
    const b = new Array(matrix[0].length);
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === 0) {
                a[i] = 0;
                b[j] = 0;
            }
        }
    }
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[0].length; j++) {
            if (a[i] === 0 || b[j] === 0) {
                matrix[i][j] = 0;
            }
        }
    }
};