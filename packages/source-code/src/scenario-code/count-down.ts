/**
 * 实现倒计时，要求有暂停开始重置方法
 */
class Countdown {
    /** 具体时间 */
    totalSenconds: number;
    remainingSeconds: number;
    /** 定时器 */
    timeId: number | null;
    constructor(hours: number, minutes: number, seconds: number) {
        this.totalSenconds = hours * 60 * 60 + minutes * 60 + seconds;
        this.remainingSeconds = this.totalSenconds;
        this.timeId = null;
    }

    start() {
        if (this.timeId) {
            console.log("Starting...");
            return;
        }
        console.log("Start Time");
        this.timeId = setInterval(() => {
            if (this.remainingSeconds <= 0) {
                this.pause();
                return;
            }
            this.remainingSeconds--;
            this.displayTime();
        }, 1000);
    }

    pause() {
        console.log("Pause Time");
        clearInterval(this.timeId as number);
        this.timeId = null;
    }

    reset() {
        this.pause();
        this.remainingSeconds = this.totalSenconds;
    }

    displayTime() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const seconds = this.remainingSeconds % 60;
    
        console.log(`${hours}:${minutes}:${seconds}`);
    }
}

const countdown = new Countdown(1, 30, 0); // 倒计时1小时30分钟
countdown.start(); // 开始倒计时
setTimeout(() => countdown.pause(), 5000); // 5秒后暂停倒计时
setTimeout(() => countdown.start(), 10000); // 10秒后继续倒计时
setTimeout(() => countdown.reset(), 15000); // 15秒后重置倒计时
