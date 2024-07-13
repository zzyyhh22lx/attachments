/**
有一个考察队到野外考察,在考察路线上有n个地点可以作为音营地,已
知宿营地到出发点的距离依次为x1,x2,....xn,且满足x1<x2<...<xn
每天他们只能前进30千米,而任意两个相邻的宿营地之间的距离都不超
过30千米,在每个宿营地只住1天.他们希望找到一个行动计划,使得总的
宿营天数达到最少.
 */
function findMinimumCampingDays(distances, maxDistancePerDay) {
    // distances: 宿营地到出发点的距离数组，已经按升序排列
    // maxDistancePerDay: 每天可以前进的最大距离

    let currentDistance = 0; // 当前的总距离
    let days = 0; // 总的宿营天数

    for (let i = 0; i < distances.length; i++) {
        // 如果当前宿营地的距离减去已经走过的距离大于每天的最大距离
        // 那么前一天就应该宿营，否则继续前进
        if (distances[i] - currentDistance > maxDistancePerDay) {
            currentDistance = distances[i - 1]; // 在前一天的宿营地宿营
            days++; // 宿营天数加一
        }
    }

    days++; // 最后一个宿营地也需要宿营

    return days;
}

const distances = [10, 20, 25, 27, 29, 40, 50, 55, 60, 70]; // 宿营地到出发点的距离
const maxDistancePerDay = 30; // 每天能前进的最大距离
console.log(findMinimumCampingDays(distances, maxDistancePerDay)); // 3

// 
// dp
// 迭代和递归
// 
