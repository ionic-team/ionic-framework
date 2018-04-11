import { Injectable } from '@angular/core';

@Injectable()
export class DomController {

  read(cb: RafCallback) {
    getQueue().read(cb);
  }

  write(cb: RafCallback) {
    getQueue().write(cb);
  }
}

function getQueue() {
  const ionic = (window as any).Ionic;
  return ionic.queue;
}

export type RafCallback = { (timeStamp?: number): void };
