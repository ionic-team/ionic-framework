import { Injectable } from '@angular/core';

import { Config } from '../../config/config';
import { removeArrayItem } from '../../util/util';


@Injectable()
export class ImgLoader {
  private wkr: Worker;
  private callbacks: Function[] = [];
  private ids = 0;
  private url: string;

  constructor(config: Config) {
    this.url = config.get('imgWorkerUrl', IMG_WORKER_URL);
  }

  load(src: string, cache: boolean, callback: Function) {
    if (src) {
      (<any>callback).id = this.ids++;
      this.callbacks.push(callback);
      this.worker().postMessage(JSON.stringify({
        id: (<any>callback).id,
        src: src,
        cache: cache
      }));
    }
  }

  cancelLoad(callback: Function) {
    removeArrayItem(this.callbacks, callback);
  }

  abort(src: string) {
    if (src) {
      this.worker().postMessage(JSON.stringify({
        src: src,
        type: 'abort'
      }));
    }
  }

  private worker() {
    if (!this.wkr) {
      // create the worker
      this.wkr = new Worker(this.url);

      // create worker onmessage handler
      this.wkr.onmessage = (ev: MessageEvent) => {
        // we got something back from the web worker
        // let's emit this out to everyone listening
        const msg: ImgResponseMessage = JSON.parse(ev.data);
        const callback = this.callbacks.find(cb => (<any>cb).id === msg.id);
        if (callback) {
          callback(msg);
          removeArrayItem(this.callbacks, callback);
        }
      };

      // create worker onerror handler
      this.wkr.onerror = (ev: ErrorEvent) => {
        console.error(`ImgLoader, worker ${ev.type} ${ev.message ? ev.message : ''}`);
        this.callbacks.length = 0;
        this.wkr.terminate();
        this.wkr = null;
      };
    }

    // return that hard worker
    return this.wkr;
  }

}

const IMG_WORKER_URL = 'build/ion-img-worker.js';

export interface ImgResponseMessage {
  id: number;
  src: string;
  status?: number;
  data?: string;
  msg?: string;
}
