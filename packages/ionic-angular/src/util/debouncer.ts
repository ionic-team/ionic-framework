

export interface Debouncer {
  debounce(callback: Function): void;
  cancel(): void;
}

export class TimeoutDebouncer implements Debouncer {
  private timer: number = null;
  callback: Function;

  constructor(public wait: number) { }

  debounce(callback: Function) {
    this.callback = callback;
    this.schedule();
  }

  schedule() {
    this.cancel();
    if (this.wait <= 0) {
      this.callback();
    } else {
      this.timer = setTimeout(this.callback, this.wait);
    }
  }

  cancel() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

}
