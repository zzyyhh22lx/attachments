const O = [
    {value: '11', group: undefined},
    {value: '112'},
    {value: '3', group: 'a'},
    {value: '1', group: 'a'},
    {value: '1', group: null},
    {value: '12', group: null},
];

/**
 *
 * 实现getRes函数，要求按group整合，按value排序
[
    [{value: '11', group: undefined}],
    [{value: '112'}],
    [{value: '3', group: 'a'},{value: '1', group: 'a'}]
]
 * 
 */
function getRes(obj = O) {
    const res = [];
    const hp = new Map();
    // i, j 分别存放undefined的索引
    const i = 0, j = 1;
    let p = 2;
    obj.forEach((item, index) => {
        if (typeof item.group === 'undefined') {
            if (Object.keys(item).includes('group')) {
                setItem(j, item);
            } else {
                setItem(i, item);
            }
        } else {
            if (hp.has(item.group)) {
                const q = hp.get(item.group);
                setItem(q, item);
            } else {
                hp.set(item.group, p);
                setItem(p++, item);
            }
        }
    })
    if (!res[i]) {
        res.shift();
    }
    if (!res[j]) {
        res.shift();
    }
    res.forEach(item => {
        item.sort((a, b) => ~~a.value - ~~b.value);
    })
    return res;
    function setItem(i, item) {
        if (!res[i]) {
            res[i] = [];
        }
        res[i].push(item);
    }
}
console.log(getRes(O));
