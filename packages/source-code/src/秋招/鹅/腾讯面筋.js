// 实现并集、交集、差集
const A1 = [1,1,2,3], B1 = [3,4,1];

// 并集
console.log([...new Set(A1), ...new Set(B1)]);
// 交集
console.log([...new Set(A1)].filter(i => B1.includes(i)));
// 差集
console.log([...new Set(A1)].filter(i => !B1.includes(i)));







// 实现arrConsole，每隔一秒打印一个数，最后打印6
arrConsole([1,2,3,4,5], () => {
    console.log(6);
})
async function arrConsole(A, fn) {
    /*
        async awit实现
    */
    // function wait(timer) {
    //     return new Promise(resolve => setTimeout(resolve, timer))
    // }
    // for(let i of A) {
    //     await wait(1000);
    //     console.log(i);
    // }
    // fn();
    
    /*
        非aync await实现
    */
    function wait(timer, value) {
        return new Promise(resolve => {
            if(!value) resolve();
            setTimeout(resolve.bind(null, value), timer)
        })
    }
    function *G() {
        yield* A
    }
    const g = G();
    (function I() {
        wait(1000, g.next().value).then((res) => {
            if(!res) return fn()
            console.log(res);
            I();
        })
    })()
}

// 金额格式化 1234567890 -> 1,234,567,890 保留两位小数
function formatPrice(price) { // 正则
    return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function formatPrice(price) {
    let index = 0;
    price = String(price).split('.');
    if(!price[1]) price[1] = 0;
    return Array.prototype.reduceRight.call(price[0], (pre, next) => {
        if(++index % 3 === 0) next = ',' + next;
        return next + pre;
    }, '') + Number('0.' + price[1]).toFixed(2).slice(1);
}
console.log(`金融格式化为：${formatPrice(1234567890.1234)}`)

// 在一串字符串中找到最长的有效字符串，并返回其长度(有效指的是连续的大小写字母，使用正则)
function validSLength(str) {
    return str.split(/[^a-zA-Z]/).reduce((pre, next) => Math.max(pre, next.length), 0)
}
console.log('最大长度为：' + validSLength('@ascd.1AsByas+=[assd'));

// 解析parm为对象
const url = "https://www.baidu.com/s?wd=%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E9%A2%98%E6%8A%A5%E5%91%8A&rsv_spt=1&rsv_iqid=0xa3f5eb180001d272&issp=1&f=8&rsv_bp=1&rsv_idx=2&ie=utf-8&tn=baiduhome_pg&rsv_enter=1&rsv_dl=ib&rsv_sug3=2&rsv_n=2";
function urlPars(url) {
    let params = url.split('?')[1];
    if(!params) return;
    return params.split('&').reduce((pre, next) => {
        const mes = next.split('=');
        pre[mes[0]] = mes[1];
        return pre;
    }, {})
}
console.log(urlPars(url));

// 解析url
// http  ://  a.com  :  80   /news/detail   ?  id=1  #t1
// scheme     demain    port     path         query    hash
function checkURL(url){
    return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(url)
}
console.log(checkURL('http://localhost.com'))

// 转中划线为小驼峰式
function transName(arr) {
    return arr.map(str => str.replace(/-[a-zA-Z]/g, match => match.replace('-', '').toUpperCase()).replace(/^[a-zA-Z]/, match => match.toLowerCase()));
}
console.log(transName(['A-b-cee', 'ca-de-ea', 'e-fe-eaa','f-g','mn']))
// [ 'aBCee', 'caDeEa', 'eFeEaa', 'fG', 'mn' ]

// 转小驼峰改为中划线
function transName2(arr) {
    return arr.map(str => str.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`))
}
console.log(transName2(['aBCee', 'caDeEa', 'eFeEaa', 'fG', 'mn']))
// [ 'a-b-cee', 'ca-de-ea', 'e-fe-eaa', 'f-g', 'mn' ]


// 日期格式化
function formatDate(date, format) {
    let addZero = function (data) {
        if (data < 10) {
            return '0' + data
        }
        return data
    }
    let obj = {
        // 对于 2023-02-14 19:30:36 星期二
        'yyyy': date.getFullYear(), // 年份 2023
        'yy': date.getFullYear() % 100, // 23
        'MM': addZero(date.getMonth() + 1), // 补满两位，02
        'M': date.getMonth() + 1, // 2
        'dd': addZero(date.getDate()),
        'd': date.getDate(),
        'HH': addZero(date.getHours()),
        'H': date.getHours(),
        'hh': addZero(date.getHours() % 12),
        'h': date.getHours() % 12,
        'mm': addZero(date.getMinutes()),
        'm': date.getMinutes(),
        'ss': addZero(date.getSeconds()),
        's': date.getSeconds(),
        'w': function () {
            arr = ['日', '一', '二', '三', '四', '五', '六']
            return arr[date.getDay()]
        }()
    }
    for (let i in obj) {
        format = format.replace(i, obj[i])
    }
    return format
}
console.log(formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss 星期w'))
// 2023-04-08 00:16:41 星期六


