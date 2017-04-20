/**
 * Adopted from FastDom
 * https://github.com/wilsonpage/fastdom
 * MIT License
 */
import { Injectable } from '@angular/core';
import { Platform } from './platform';
import { removeArrayItem } from '../util/util';


/**
 * @hidden
 */
export class DomDebouncer {

  private writeTask: Function = null;
  private readTask: Function = null;

  constructor(private dom: DomController) { }

  read(fn: DomCallback): Function {
    if (this.readTask) {
      return;
    }
    return this.readTask = this.dom.read((t) => {
      this.readTask = null;
      fn(t);
    });
  }

  write(fn: DomCallback): Function {
    if (this.writeTask) {
      return;
    }

    return this.writeTask = this.dom.write((t) => {
      this.writeTask = null;
      fn(t);
    });
  }

  cancel() {
    const writeTask = this.writeTask;
    writeTask && this.dom.cancel(writeTask);

    const readTask = this.readTask;
    readTask && this.dom.cancel(readTask);
    this.readTask = this.writeTask = null;
  }
}


/**
 * @hidden
 */
@Injectable()
export class DomController {
  private r: Function[] = [];
  private w: Function[] = [];
  private q: boolean;

  constructor(public plt: Platform) {}

  debouncer(): DomDebouncer {
    return new DomDebouncer(this);
  }

  read(fn: DomCallback, timeout?: number): any {
    if (timeout) {
      (<any>fn).timeoutId = this.plt.timeout(() => {
        this.r.push(fn);
        this._queue();
      }, timeout);

    } else {
      this.r.push(fn);
      this._queue();
    }
    return fn;
  }

  write(fn: DomCallback, timeout?: number): any {
    if (timeout) {
      (<any>fn).timeoutId = this.plt.timeout(() => {
        this.w.push(fn);
        this._queue();
      }, timeout);

    } else {
      this.w.push(fn);
      this._queue();
    }
    return fn;
  }

  cancel(fn: any): void {
    if (fn) {
      if (fn.timeoutId) {
        this.plt.cancelTimeout(fn.timeoutId);
      }
      removeArrayItem(this.r, fn) || removeArrayItem(this.w, fn);
    }
  }

  private _queue() {
    const self = this;
    if (!self.q) {
      self.q = true;
      self.plt.raf(function rafCallback(timeStamp) {
        self._flush(timeStamp);
      });
    }
  }

  private _flush(timeStamp: number) {
    let err: any;

    try {
      dispatch(timeStamp, this.r, this.w);
    } catch (e) {
      err = e;
    }

    this.q = false;

    if (this.r.length || this.w.length) {
      this._queue();
    }

    if (err) {
      throw err;
    }
  }

}

function dispatch(timeStamp: number, r: Function[], w: Function[]) {
  let fn: Function;

  // ******** DOM READS ****************
  while (fn = r.shift()) {
    fn(timeStamp);
  }

  // ******** DOM WRITES ****************
  while (fn = w.shift()) {
    fn(timeStamp);
  }
}


/**
 * @hidden
 */
export type DomCallback = { (timeStamp?: number): void };
