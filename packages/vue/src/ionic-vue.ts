import { App, Plugin } from 'vue';
import { IonicConfig, setupConfig } from '@ionic/core';
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';

/**
 * We need to make sure that the web component fires an event
 * that will not conflict with the user's @ionChange binding,
 * otherwise the binding's callback will fire before any
 * v-model values have been updated.
 */
const transformEventName = (eventName: string) => {
  return eventName === 'ionChange' ? 'v-ionchange' : eventName.toLowerCase();
}
const ael = (el: any, eventName: string, cb: any, opts: any) => el.addEventListener(transformEventName(eventName), cb, opts);
const rel = (el: any, eventName: string, cb: any, opts: any) => el.removeEventListener(transformEventName(eventName), cb, opts);

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
        ce: (eventName: string, opts: any) => new CustomEvent(transformEventName(eventName), opts),
        ael,
        rel
      } as any);
    }
  }
};
