class TreeNode {
    val: number
    left: TreeNode | null
    right: TreeNode | null
    constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
        this.val = (val===undefined ? 0 : val)
        this.left = (left===undefined ? null : left)
        this.right = (right===undefined ? null : right)
    }
}
/**
 * Definition for a binary tree node.
 */

function levelOrder(root: TreeNode | null): number[][] {
    const res: number[][] = [];
    function levelOrder(node: TreeNode | null, level: number) {
        if (!node) return;
        if (!res[level]) res.push([]);
        res[level].push(node.val);
        levelOrder(node.left, level + 1);
        levelOrder(node.right, level + 1);
    }
    levelOrder(root, 0);
    return res;
};
