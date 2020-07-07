import { Config } from '@stencil/core';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'Ionic',
  outputTargets: [
    vueOutputTarget({
      componentCorePackage: '@ionic/core',
      proxiesFile: './src/proxies.ts',
      componentModels: [
        {
          elements: ['ion-input'],
          targetAttr: 'value',
          event: 'ionChange'
        }
      ],
    }),
    {
      type: 'dist',
    },
  ],
};
