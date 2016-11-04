
import { nativeRaf } from './dom';

export interface Debouncer {
  debounce(Function);
  cancel();
}


export class FakeDebouncer implements Debouncer {
  debounce(callback: Function) {
    callback();
  }
  cancel() {}
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

export class NativeRafDebouncer implements Debouncer {
  callback: Function = null;
  fireFunc: Function;
  ptr: number = null;

  constructor() {
    this.fireFunc = this.fire.bind(this);
  }

  debounce(callback: Function) {
    if (this.callback === null) {
      this.callback = callback;
      this.ptr = nativeRaf(this.fireFunc);
    }
  }

  fire() {
    this.callback();
    this.callback = null;
    this.ptr = null;
  }

  cancel() {
    if (this.ptr !== null) {
      cancelAnimationFrame(this.ptr);
      this.ptr = null;
      this.callback = null;
    }
  }

}

