function executeTasks(tasks) {
    const n = tasks.length;
    const PR = new Array(n);
    let index = 0;
    for(let i = 0; i < n; i++) {
        tasks[i]().then(res => {
            PR[i] = res;
        }).catch(e => {
            PR[i] = `task ${i+1} failed`;
        }).finally(() => {
            setIntervalConsole(i, () => {
                console.log(PR[index++]);
            });
        })
    }
    function setIntervalConsole(i, fn) {
        return setTimeout(() => {
            if (index === i) {
                fn();
                return;
            }
            setIntervalConsole(i, fn);
        });
    }
}
// 示例用法
const task1 = () => new Promise(resolve => setTimeout(() => resolve('Result of Task 1'), 2000));
const task2 = () => new Promise(resolve => setTimeout(() => resolve('Result of Task 2'), 1000));
const task3 = () => new Promise(resolve => setTimeout(() => resolve('Result of Task 3'), 4000));
const task4 = () => new Promise((resolve, reject) => setTimeout(() => reject('some error'), 4000));
executeTasks([task1, task2, task3, task4]);
// 预期2000ms后输出：
// 'Result of Task 1'
// 'Result of Task 2'
// 再过2000ms后输出：
// 'Result of Task 3'
// 'task 4 failed
