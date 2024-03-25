function executeTasks(tasks) {
    tasks.reduce((promiseChain, currentTask) => {
        return promiseChain.then(() => {
            return currentTask().then(result => {
                console.log(result);
            }).catch(error => {
                console.error(error);
            });
        });
    }, Promise.resolve());
}
