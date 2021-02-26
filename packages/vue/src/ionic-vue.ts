import { App, Plugin } from 'vue';
import { IonicConfig, setupConfig } from '@ionic/core';
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';

const needsKebabCase = (version: string) => !['3.0.0', '3.0.1', '3.0.2', '3.0.3', '3.0.4', '3.0.5'].includes(version);

/**
* We need to make sure that the web component fires an event
* that will not conflict with the user's @ionChange binding,
* otherwise the binding's callback will fire before any
* v-model values have been updated.
*/
const toLowerCase = (eventName: string) => eventName === 'ionChange' ? 'v-ionchange' : eventName.toLowerCase();
const toKebabCase = (eventName: string) => eventName === 'ionChange' ? 'v-ion-change' : eventName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Vue 3.0.6 fixed a bug where events on custom elements
 * were always converted to lower case, so "ionRefresh"
 * became "ionRefresh". We need to account for the old
 * issue as well as the new behavior where "ionRefresh"
 * is converted to "ion-refresh".
 * See https://github.com/vuejs/vue-next/pull/2847
 */
const getHelperFunctions = (needsKebabCase: boolean = true) => {
  const conversionFn = (needsKebabCase) ? toKebabCase : toLowerCase;
  return {
      ael: (el: any, eventName: string, cb: any, opts: any) => el.addEventListener(conversionFn(eventName), cb, opts),
      rel: (el: any, eventName: string, cb: any, opts: any) => el.removeEventListener(conversionFn(eventName), cb, opts),
      ce: (eventName: string, opts: any) => new CustomEvent(conversionFn(eventName), opts)
  };
};

export const IonicVue: Plugin = {

  async install(app: App, config: IonicConfig = {}) {
    if (typeof (window as any) !== 'undefined') {
      const { ael, rel, ce } = getHelperFunctions(needsKebabCase(app.version));
      setupConfig({
        ...config,
        _ael: ael,
        _rel: rel,
      });
      await applyPolyfills();
      await defineCustomElements(window, {
        exclude: ['ion-tabs'],
        ce,
        ael,
        rel
      } as any);
    }
  }
};
