// https://leetcode.cn/problems/stone-game/description/
// 对于石子游戏，如果是总数是偶数，则先取的必赢
// 因为先取者可以选择取下标为奇书或者偶数的数，可以通过判断总和来确定

// https://leetcode.cn/problems/predict-the-winner/
var predictTheWinner = function(nums) {
    const play = (i, j) => { // play得到的是净胜分，双方都选择最优
        if (i > j) return 0; // 为什么不用=，因为还可以取
        const planA = nums[i] - play(i + 1, j); // 如果选择了i，下次对手只能选择i+1, j
        const planB = nums[j] - play(i, j - 1);
        return Math.max(planA, planB);
    }
    return play(0, nums.length - 1) >= 0;
};
