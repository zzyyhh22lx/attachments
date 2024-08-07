const validator = new Proxy({}, {
    get(target) {
      return function (value, ...rules) {
        console.log(value);
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
    isEmail: (value) => /\S+@\S+\.\S+/.test(value),
};
  
const user = {
    name: 'lhy'.repeat(10),
    email: 'johndoe@example.com',
};
  
console.log(validator.name(user.name, rules.minLength(3), rules.maxLength(20)));
validator.email(user.email, rules.isEmail);