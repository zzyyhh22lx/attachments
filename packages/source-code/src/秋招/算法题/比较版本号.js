// https://leetcode.cn/problems/compare-version-numbers/description/
// 企业微信
/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
var compareVersion = function(version1, version2) {
    const filterList = (list) => {
        return list.map(item => item.replace(/^0*/, ''));
    }
    const list1 = filterList(version1.split('.')),
        list2 = filterList(version2.split('.'));
    const maxLength = Math.max(list1.length, list2.length);
    for(let i = 0; i < maxLength; i++) {
        const item1 = ~~list1[i], item2 = ~~list2[i];
        if (item1 > item2) return 1;
        if (item2 > item1) return -1;
    }
    return 0;
};
