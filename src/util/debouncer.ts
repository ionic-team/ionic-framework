
export class Debouncer {
  private timer: number = null;
  callback: Function;

  constructor(public wait: number) { }

  debounce(callback: Function) {
    this.callback = callback;
    this.schedule();
  }

  schedule() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.wait <= 0) {
      this.callback();
    } else {
      this.timer = setTimeout(this.callback, this.wait);
    }
  }

}
