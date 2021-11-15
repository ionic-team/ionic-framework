import { NgZone } from '@angular/core';
import { initialize } from '@ionic/core/components';

import { Config } from './providers/config';
import { IonicWindow } from './types/interfaces';
import { raf } from './util/util';

export const appInitialize = (config: Config, doc: Document, zone: NgZone) => {
  return (): any => {
    const win: IonicWindow | undefined = doc.defaultView as any;
    if (win && typeof (window as any) !== 'undefined') {
      const aelFn =
        '__zone_symbol__addEventListener' in (doc.body as any) ? '__zone_symbol__addEventListener' : 'addEventListener';

      initialize({
        ...config,
        _zoneGate: (h: any) => zone.run(h),
        _ael: (elm, eventName, cb, opts) => {
          (elm as any)[aelFn](eventName, cb, opts);
        },
        _rel: (elm, eventName, cb, opts) => {
          elm.removeEventListener(eventName, cb, opts);
        },
        // _ce: ce,
        raf: raf
      });

      // TODO determine if we need to apply polyfills



      // return applyPolyfills().then(() => {
      //   return defineCustomElements(win, {
      //     exclude: ['ion-tabs', 'ion-tab'],
      //     syncQueue: true,
      //     raf,
      //     jmp: (h: any) => zone.runOutsideAngular(h),
      //     ael(elm, eventName, cb, opts) {
      //       (elm as any)[aelFn](eventName, cb, opts);
      //     },
          // rel(elm, eventName, cb, opts) {
          //   elm.removeEventListener(eventName, cb, opts);
          // },
      //   });
      // });
    }
  };
};
