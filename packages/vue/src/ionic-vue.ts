import { App, Plugin } from 'vue';
import { IonicConfig, setupConfig } from '@ionic/core';
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';

const ael = (el: any, eventName: string, cb: any, opts: any) => el.addEventListener(eventName.toLowerCase(), cb, opts);
const rel = (el: any, eventName: string, cb: any, opts: any) => el.removeEventListener(eventName.toLowerCase(), cb, opts);

export const IonicVue: Plugin = {

  async install(_app: App, config: IonicConfig = {}) {
    if (typeof (window as any) !== 'undefined') {
      setupConfig({
        ...config,
        _ael: ael,
        _rel: rel,
      });
      await applyPolyfills();
      await defineCustomElements(window, {
        exclude: ['ion-tabs'],
        ce: (eventName: string, opts: any) => new CustomEvent(eventName.toLowerCase(), opts),
        ael,
        rel
      } as any);
    }
  }
};
