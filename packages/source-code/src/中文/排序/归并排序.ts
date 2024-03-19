// 归并
// 递归和分治
// 把数组平均分
// 双指针把两个有序数组进行排序

//     [5,4,2,6]
//  [5,4]    [2,6]    // mid = Math.floor(n / 2);
//[5]  [4]  [2]  [6]  // mid === 1 排序并回溯
//  [4,5]    [2,6]
//     [2,4,5,6]

// 平均复杂度O(nlogn)
export function mergeSort(A: number[]): number[] {
    const n = A.length;
    let mid = Math.floor(n / 2);
    if (mid === 0) return A;
    return merge(mergeSort(A.slice(0, mid)), mergeSort(A.slice(mid)));
}
/**
 * 排序俩个有序数组
 * 双指针
 * @param A 
 * @param B 
 */
export function merge(A: number[], B: number[]): number[] {
    const n = A.length + B.length;
    let i = 0, j = 0;
    A.push(Number.MAX_VALUE), B.push(Number.MAX_VALUE)
    const res: number[] =  [];
    while(i + j < n) {
        if (A[i] > B[j]) {
            res.push(B[j++]);
        } else {
            res.push(A[i++]);
        }
    }
    A.pop(), B.pop();
    return res;
}