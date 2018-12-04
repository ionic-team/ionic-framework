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
  const Ionic = (window as any).Ionic;
  if (Ionic && Ionic.queue) {
    return Ionic.queue;
  }

  return {
    read: (cb: any) => window.requestAnimationFrame(cb),
    write: (cb: any) => window.requestAnimationFrame(cb)
  };
}

export type RafCallback = (timeStamp?: number) => void;
