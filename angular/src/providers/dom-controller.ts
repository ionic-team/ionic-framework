import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DomController {

  /**
   * Schedules a task to run during the READ phase of the next frame.
   * This task should only read the DOM, but never modify it.
   */
  read(cb: RafCallback) {
    getQueue().read(cb);
  }

  /**
   * Schedules a task to run during the WRITE phase of the next frame.
   * This task should write the DOM, but never READ it.
   */
  write(cb: RafCallback) {
    getQueue().write(cb);
  }
}

function getQueue() {
  const win = typeof (window as any) !== 'undefined' ? window : null as any;

  if (win != null) {
    const Ionic = win.Ionic;
    if (Ionic && Ionic.queue) {
      return Ionic.queue;
    }

    return {
      read: (cb: any) => win.requestAnimationFrame(cb),
      write: (cb: any) => win.requestAnimationFrame(cb)
    };
  }

  return {
    read: (cb: any) => cb(),
    write: (cb: any) => cb()
  };
}

export type RafCallback = (timeStamp?: number) => void;
