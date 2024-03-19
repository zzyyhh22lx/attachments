class Countdown {
  constructor(hours, minutes, seconds) {
    this.totalSeconds = hours * 3600 + minutes * 60 + seconds;
    this.remainingSeconds = this.totalSeconds;
    this.timerId = null;
  }

  start() {
    if (this.timerId) {
      console.log('计时器已经启动');
      return;
    }

    this.timerId = setInterval(() => {
      this.remainingSeconds--;

      if (this.remainingSeconds < 0) {
        clearInterval(this.timerId);
        this.timerId = null;
        this.remainingSeconds = 0;
      }

      this.displayTime();
    }, 1000);
  }

  pause() {
    if (!this.timerId) {
      console.log('计时器未启动');
      return;
    }

    clearInterval(this.timerId);
    this.timerId = null;
  }

  reset() {
    this.pause();
    this.remainingSeconds = this.totalSeconds;
    this.displayTime();
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