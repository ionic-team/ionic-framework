import { App, Plugin } from 'vue';
import { IonicConfig, initialize } from '@ionic/core/components';

const ael = (el: any, eventName: string, cb: any, opts: any) => el.addEventListener(eventName.toLowerCase(), cb, opts);
const rel = (el: any, eventName: string, cb: any, opts: any) => el.removeEventListener(eventName.toLowerCase(), cb, opts);

export const IonicVue: Plugin = {

  async install(_app: App, config: IonicConfig = {}) {
    if (typeof (window as any) !== 'undefined') {
      initialize({
        ...config,
        _ael: ael,
        _rel: rel,
      })
    }
  }
};
