const object = { 'a': [{ 'b': { 'c': 3 } }] };
 
console.log(get(object, 'a[0].b.c'));
// => 3
 
console.log(get(object, ['a', '0', 'b', 'c']));
// => 3
 
console.log(get(object, 'a.b.c', 'default'));
// => 'default'

function get(obj: Object, keys: string[] | string, defaultValue?: any) {
    let result: any = obj;
    if (!Array.isArray(keys)) {
        keys = keys.trim().replace(/\[(.*)\]/g, (match, childStr) => {
            return `.${childStr}`
        }).split('.');
    }
    for(let i = 0; i < keys.length; i++) {
        result = result[keys[i]];
        if (!result) return defaultValue;
    }
    return result ?? defaultValue;
}
