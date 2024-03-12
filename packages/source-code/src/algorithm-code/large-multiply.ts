/**
 * 大数相乘
 * @param a 
 * @param b 
 * @returns 
 */
export function bigNumberMultiply(a, b) {
  if (a === '0' || b === '0') return '0';

  const res = Array(a.length + b.length).fill(0);
  a = a.split('').reverse();
  b = b.split('').reverse();

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const product = a[i] * b[j] + res[i + j];
      res[i + j] = product % 10;
      res[i + j + 1] += Math.floor(product / 10);
    }
  }

  while (res.length > 1 && res[res.length - 1] === 0) {
    res.pop();
  }

  return res.reverse().join('');
}
