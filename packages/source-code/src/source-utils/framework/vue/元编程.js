const validator = new Proxy({}, {
    get(target) {
      return function (value, ...rules) {
        for (let rule of rules) {
          if (!rule(value)) {
            // throw new Error(`验证失败啦`);
            return false;
          }
        }
        return true;
      }
    }
});
const rules = {
    minLength: (length) => (value) => value.length >= length,
    maxLength: (length) => (value) => value.length <= length,
    // \s匹配一个空白字符，包括空格、制表符、换页符和换行符
    isEmail: (value) => /\S+@\S+\.\S+/.test(value),
};
  
const user = {
    name: 'lhy'.repeat(10),
    email: 'johndoe@example.com',
};
  
console.log(validator.name(user.name, rules.minLength(3), rules.maxLength(20)));
validator.email(user.email, rules.isEmail);

const compose = (target) => (...rules) => rules.reduceRight((pre, rule) => pre && rule(target), true);

const pipe = (target) => (...rules) => rules.reduce((pre, rule) => pre && rule(target), true);

console.log(compose(user.name)(rules.minLength(3), rules.maxLength(20)));
console.log(pipe(user.email)(rules.isEmail));

// 假如有一个对象: let target = { name: 'zf', get alias() { return this.name }}; // get，es5取属性值
// 并调用 proxy.alias，此时在alias上取了值，也去了name，但是没有监控到name，
// this会变成target，而不是代理对象，此时不会进行proxy代理
let target = { name: 'zf', get getName() { return this.name }};
const T = new Proxy(target, {
    get(target, prop) {
        console.log('进来一次')
        return target[prop];
    },
    set(target, prop, value) {
        return target[prop] = value;
    }
})
console.log(T.getName); // ('进来一次')zf

const T2 = new Proxy(target, {
    get(...args) {
        console.log('我进来一次')
        return Reflect.get(...args);
    },
    set(...args) {
        return Reflect.set(...args);
    }
})
console.log(T2.getName); // ('进来一次')('进来一次')zf

let a = { name: 'lzf', getName() { return this.name }};
const A = new Proxy(a, {
    get(...args) {
        console.log('我进来一次')
        return Reflect.get(...args);
    },
    set(...args) {
        // Reflect是一个内置的对象，它提供了拦截JavaScript操作的方法。这些方法与Proxy handlers的方法相对应。
        return Reflect.set(...args);
    }
})
console.log(A.getName()); // zf
