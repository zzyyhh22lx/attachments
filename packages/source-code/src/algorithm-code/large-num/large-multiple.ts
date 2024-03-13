/**
 * 大数相乘
 * @param {*} a 
 * @param {*} b 
 */
export const largeMultiple = (a, b) => {
  if (a === '0' || b === '0') return '0';
  let res = new Array(a.length * b.length).fill(0);
  a = a.split('').reverse();
  b = b.split('').reverse();
  for(let i = 0; i < a.length; i++) {
      for(let j = 0; j < b.length; j++) {
          const t = a[i] * b[j] + res[i + j];
          res[i + j] = t % 10;
          res[i + j + 1] += Math.floor(t / 10);
      }
  }
  return res.reverse().join('').replace(/^0*/g, '');
}
console.log(largeMultiple(a, b), 1234 * 889)
