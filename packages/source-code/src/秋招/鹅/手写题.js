// 转下划线为小驼峰式
function transName(arr) {
    return arr.map(item => (
        item.split('_').map((string, index) => {
            const lowerString = string.toLowerCase();
            if (index === 0) return lowerString;
            return lowerString.replace(/^[a-zA-Z]/, match => match.toUpperCase());
        }).join('')
    ))
}
console.log(transName(['A_b_cee', 'ca_de_ea', 'e_fe_eaa','f_g','mn']))
// [ 'aBCee', 'caDeEa', 'eFeEaa', 'fG', 'mn' ]

// 转小驼峰改为下划线
function transName2(arr) {
    return arr.map(item => (
        item.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`)
    ))
}
console.log(transName2(['aBCee', 'caDeEa', 'eFeEaa', 'fG', 'mn']))
// [ 'a_b_cee', 'ca_de_ea', 'e_fe_eaa', 'f_g', 'mn' ]

// 模版字符串替换
/**
\w	
匹配一个单字字符（字母、数字或者下划线）。等价于 [A-Za-z0-9_]
\W	
匹配一个非单字字符。等价于 [^A-Za-z0-9_]
 */
function templateStringReplace(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || match;
  });
}

const template = "Hello, {{name}}! Today is {{day}}.";
const data = {
  name: "Alice",
  day: "Monday"
};

const result = templateStringReplace(template, data);
console.log(result);
// "Hello, Alice! Today is Monday."