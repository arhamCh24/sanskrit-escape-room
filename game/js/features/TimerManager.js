export default class TimerManager {
  constructor() {
    this.timerId = null;
    this.remainingSeconds = 0;
  }

  start(seconds, onTick, onFinish) {
    this.stop();
    this.remainingSeconds = seconds;

    if (onTick) onTick(this.remainingSeconds);

    this.timerId = window.setInterval(() => {
      this.remainingSeconds -= 1;
      if (onTick) onTick(this.remainingSeconds);

      if (this.remainingSeconds <= 0) {
        this.stop();
        if (onFinish) onFinish();
      }
    }, 1000);
  }

  stop() {
    if (!this.timerId) return;
    window.clearInterval(this.timerId);
    this.timerId = null;
  }
}
