/**
 * Adopted from FastDom
 * https://github.com/wilsonpage/fastdom
 * MIT License
 */
import { nativeRaf } from './dom';
import { removeArrayItem } from './util';


export class DomController {
  private r: Function[] = [];
  private w: Function[] = [];
  private q: boolean;

  read(fn: Function, ctx?: any): Function {
    const task = !ctx ? fn : fn.bind(ctx);
    this.r.push(task);
    this.queue();
    return task;
  }

  write(fn: Function, ctx?: any): Function {
    const task = !ctx ? fn : fn.bind(ctx);
    this.w.push(task);
    this.queue();
    return task;
  }

  cancel(task: any) {
    return removeArrayItem(this.r, task) || removeArrayItem(this.w, task);
  }

  private queue() {
    if (!this.q) {
      this.q = true;
      nativeRaf(timestamp => {
        this.flush(timestamp);
      });
    }
  }

  private flush(timestamp: number) {
    let err;
    let task;

    try {
      // ******** DOM READS ****************
      while (task = this.r.shift()) {
        task(timestamp);
      }

      // ******** DOM WRITES ****************
      while (task = this.w.shift()) {
        task(timestamp);
      }
    } catch (e) {
      err = e;
    }

    this.q = false;

    if (this.r.length || this.w.length) {
      this.queue();
    }

    if (err) {
      throw err;
    }
  }

}
