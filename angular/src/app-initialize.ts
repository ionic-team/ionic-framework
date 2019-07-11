import { NgZone } from '@angular/core';
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';

import { Config } from './providers/config';
import { IonicWindow } from './types/interfaces';

export function appInitialize(config: Config, doc: Document, zone: NgZone) {
  return (): any => {
    const win: IonicWindow | undefined = doc.defaultView as any;
    if (win) {
      const Ionic = win.Ionic = win.Ionic || {};

      Ionic.config = {
        ...config,
        _zoneGate: (h: any) => zone.run(h)
      };

      const aelFn = '__zone_symbol__addEventListener' in (document.body as any)
        ? '__zone_symbol__addEventListener'
        : 'addEventListener';

      return applyPolyfills().then(() => {
        return defineCustomElements(win, {
          exclude: ['ion-tabs', 'ion-tab'],
          syncQueue: true,
          jmp: (h: any) => zone.runOutsideAngular(h),
          raf: h => {
            return zone.runOutsideAngular(() => {
              return (win.__zone_symbol__requestAnimationFrame) ? win.__zone_symbol__requestAnimationFrame(h) : requestAnimationFrame(h);
            });
          },
          ael(elm, eventName, cb, opts) {
            (elm as any)[aelFn](eventName, cb, opts);
          },
          rel(elm, eventName, cb, opts) {
            elm.removeEventListener(eventName, cb, opts);
          }
        });
      });
    }
  };
}
