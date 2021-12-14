import { NgZone } from '@angular/core';
import { setupConfig } from '@ionic/core';
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';

import { Config } from './providers/config';
import { IonicWindow } from './types/interfaces';
import { raf } from './util/util';

interface ZoneEventTarget extends EventTarget {
  /**
   * Zone.js Monkey-patch for addEventListener.
   */
  __zone_symbol__addEventListener: (
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean
  ) => void;
  /**
   * Zone.js Monkey-patch for removeEventListener.
   */
  __zone_symbol__removeEventListener: (
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ) => void;
}

export const appInitialize = (config: Config, doc: Document, zone: NgZone) => {
  return (): any => {
    const win: IonicWindow | undefined = doc.defaultView as any;
    if (win && typeof (window as any) !== 'undefined') {
      setupConfig({
        ...config,
        _zoneGate: (h: any) => zone.run(h),
      });

      // Use Zone.js implementation for addEventListener if present.
      const aelFn =
        '__zone_symbol__addEventListener' in (doc.body as any) ? '__zone_symbol__addEventListener' : 'addEventListener';

      // Use Zone.js implementation for removeEventListener if present.
      const relFn =
        '__zone_symbol__removeEventListener' in (doc.body as any)
          ? '__zone_symbol__removeEventListener'
          : 'removeEventListener';

      return applyPolyfills().then(() => {
        return defineCustomElements(win, {
          exclude: ['ion-tabs', 'ion-tab'],
          syncQueue: true,
          raf,
          jmp: (h: any) => zone.runOutsideAngular(h),
          ael(elm, eventName, cb, opts) {
            (elm as ZoneEventTarget)[aelFn](eventName, cb, opts);
          },
          rel(elm, eventName, cb, opts) {
            (elm as ZoneEventTarget)[relFn](eventName, cb, opts);
          },
        });
      });
    }
  };
};
