import { App, Plugin } from 'vue';
import { IonicConfig, setupConfig } from '@ionic/core';
import { applyPolyfills, defineCustomElements } from '@ionic/core/loader';

export const IonicVue: Plugin = {
  async install(_app: App, config?: IonicConfig) {
    config && setupConfig(config);
    await applyPolyfills();
    defineCustomElements(window);
  }
};
