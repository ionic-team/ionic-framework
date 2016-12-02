/**
 * Adopted from FastDom
 * https://github.com/wilsonpage/fastdom
 * MIT License
 */
import { nativeRaf } from './dom';
import { removeArrayItem } from './util';


export type DomCallback = { (timeStamp: number) };

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

  write(fn: DomCallback, ctx?: any): Function {
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
    writeTask && this.dom.cancelW(writeTask);
    this.writeTask = null;

    const readTask = this.readTask;
    readTask && this.dom.cancelR(readTask);
    this.readTask = null;
  }
}

export class DomController {

  private r: Function[] = [];
  private w: Function[] = [];
  private q: boolean;

  debouncer(): DomDebouncer {
    return new DomDebouncer(this);
  }

  read(fn: DomCallback, ctx?: any): Function {
    const task = !ctx ? fn : fn.bind(ctx);
    this.r.push(task);
    this.queue();
    return task;
  }

  write(fn: DomCallback, ctx?: any): Function {
    const task = !ctx ? fn : fn.bind(ctx);
    this.w.push(task);
    this.queue();
    return task;
  }

  cancel(task: any): boolean {
    return removeArrayItem(this.r, task) || removeArrayItem(this.w, task);
  }

  cancelW(task: any): boolean {
    return removeArrayItem(this.w, task);
  }

  cancelR(task: any): boolean {
    return removeArrayItem(this.r, task);
  }

  protected queue() {
    const self = this;
    if (!self.q) {
      self.q = true;
      nativeRaf(function rafCallback(timeStamp) {
        self.flush(timeStamp);
      });
    }
  }

  protected flush(timeStamp: number) {
    try {
      this.dispatch(timeStamp);
    } finally {
      this.q = false;
    }
  }

  private dispatch(timeStamp: number) {
    let i: number;
    const r = this.r;
    const rLen = r.length;
    const w = this.w;
    const wLen = w.length;

    // ******** DOM READS ****************
    for (i = 0; i < rLen; i++) {
      r[i](timeStamp);
    }

    // ******** DOM WRITES ****************
    for (i = 0; i < wLen; i++) {
      w[i](timeStamp);
    }

    r.length = 0;
    w.length = 0;
  }

}
