import { App, Plugin } from 'vue';
import { IonicConfig, setupConfig } from '@ionic/core';
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';

export const IonicVue: Plugin = {
  async install(_app: App, config?: IonicConfig) {
    if (typeof (window as any) !== 'undefined') {
      config && setupConfig(config);
      await applyPolyfills();
      await defineCustomElements(window, {
        ce: (eventName: string, opts: any) => new CustomEvent(eventName.toLowerCase(), opts),
        ael: (el: any, eventName: string, cb: any, opts: any) => {
          el.addEventListener(eventName.toLowerCase(), cb, opts);
        },
        rel: (el: any, eventName: string, cb: any, opts: any) => {
          el.removeEventListener(eventName.toLowerCase(), cb, opts);
        }
      } as any);
    }
  }
};
