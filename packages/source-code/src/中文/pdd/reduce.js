Array.prototype.reduce = function(fn, init) {
    let index = 0;
    let res = typeof init !== 'undefined' ? init : this[index++];
    while(index < this.length) {
        res = fn.call(this, res, this[index++], this);
    }
    return res;
}

const array1 = [1, 2, 3, 4];

// 0 + 1 + 2 + 3 + 4
const initialValue = 0;
const sumWithInitial = array1.reduce(
  (accumulator, currentValue) => accumulator + currentValue,
  initialValue,
);

console.log(sumWithInitial);
// Expected output: 10
