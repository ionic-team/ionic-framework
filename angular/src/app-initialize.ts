import { defineCustomElements } from '@ionic/core/loader';

import { Config } from './providers/config';
import { IonicWindow } from './types/interfaces';

export function appInitialize(config: Config, doc: Document) {
  return (): any => {
    const win: IonicWindow | undefined = doc.defaultView as any;
    if (win) {
      const Ionic = win.Ionic = win.Ionic || {};

      Ionic.config = config;
      Ionic.asyncQueue = false;

      Ionic.ael = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__addEventListener && skipZone(eventName)) {
          elm.__zone_symbol__addEventListener(eventName, cb, opts);
        } else {
          elm.addEventListener(eventName, cb, opts);
        }
      };

      Ionic.rel = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__removeEventListener && skipZone(eventName)) {
          elm.__zone_symbol__removeEventListener(eventName, cb, opts);
        } else {
          elm.removeEventListener(eventName, cb, opts);
        }
      };

      return defineCustomElements(win, {
        exclude: ['ion-tabs', 'ion-tab']
      });
    }
  };
}

const SKIP_ZONE = [
  'scroll',
  'resize',

  'touchstart',
  'touchmove',
  'touchend',

  'mousedown',
  'mousemove',
  'mouseup',

  'ionStyle',
];

function skipZone(eventName: string) {
  return SKIP_ZONE.indexOf(eventName) >= 0;
}
