const swap = (nums, i, j) => {
    const item = nums[i];
    nums[i] = nums[j];
    nums[j] = item;
}
const arraySort = (arr) => {
    let l = 0, r = arr.length - 1;
    for(let i = 0; i < arr.length; i++) {
        if (i >= r) break;
        if (arr[i] === 1) {
            swap(arr, i--, l++);
        }
        if (arr[i] === 2) {
            swap(arr, i--, r--);
        }
    }
    return arr;
}
console.log(arraySort([0, 1, 1, 2, 0, 1, 2, 0, 0, 1]));
