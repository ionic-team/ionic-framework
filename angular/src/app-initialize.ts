import { Config } from './providers/config';
import { defineCustomElements } from '@ionic/core';
import { IonicWindow } from './types/interfaces';


export function appInitialize(config: Config) {
  return () => {
    const win: IonicWindow = window as any;
    if (typeof win !== 'undefined') {
      const Ionic = win.Ionic = win.Ionic || {};

      Ionic.config = config;

      Ionic.ael = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__addEventListener) {
          elm.__zone_symbol__addEventListener(eventName, cb, opts);
        } else {
          elm.addEventListener(eventName, cb, opts);
        }
      };

      Ionic.rel = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__removeEventListener) {
          elm.__zone_symbol__removeEventListener(eventName, cb, opts);
        } else {
          elm.removeEventListener(eventName, cb, opts);
        }
      };

      Ionic.raf = (cb: any) => {
        if (win.__zone_symbol__requestAnimationFrame) {
          win.__zone_symbol__requestAnimationFrame(cb);
        } else {
          win.requestAnimationFrame(cb);
        }
      };

      // define all of Ionic's custom elements
      defineCustomElements(win);
    }
  };
}
