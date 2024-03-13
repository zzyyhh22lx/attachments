/**
 * 阿拉伯数转汉字
 * 12345678
 * 一千二百三十四万五千六百七十八
 * 思路：从字符串最后一位出发，遇到0则+零，最后再考虑情况
 */
const transform = (num: number) => {
    const hp = new Map([
        ['0', '零'], ['1', '一'], ['2', '二'],
        ['3', '三'], ['4', '四'], ['5', '五'],
        ['6', '六'], ['7', '七'], ['8', '八'], ['9', '九']
    ]);
    const queue = ['千亿', '百亿', '十亿', '亿', '千万', '百万', '十万', '万', '千', '百', '十', ''];
    let ns = String(num);
    let res = '';
    for(let i = ns.length - 1; i >= 0; i--) {
        if (ns[i] === '0') {
            queue.pop();
            res = '零' + res;
        } else {
            res = (hp.get(ns[i]) as string) + (queue.pop() as string) + res;
        }
    }
    res = removeDuplicatesExceptLast(res, '万');
    res = removeDuplicatesExceptLast(res, '亿');

    while(res.indexOf('零零') !== -1) {
        res = res.replace('零零', '零');
    }
    // 去除最后一个零
    if (res[res.length - 1] === '零') res = res.slice(0, -1);
    return res;
};

function removeDuplicatesExceptLast(str, char) {
    const lastIndex = str.lastIndexOf(char);
    const regex = new RegExp(char, 'g');
    return str.replace(regex, (match, index) => (index === lastIndex ? match : ''));
}

console.log(transform(9024190101))
