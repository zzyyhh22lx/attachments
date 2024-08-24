// proxy是浅层代理
const a = new Proxy({
    a: {
        b: 1
    }
}, {
    get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
        const result = Reflect.set(target, prop, value, receiver);
        console.log('bbbb'); // 不会触发
        return result;
    }
});

console.log(a.a.b = 2);