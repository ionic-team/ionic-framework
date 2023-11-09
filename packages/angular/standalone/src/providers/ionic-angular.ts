import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import type { Provider } from '@angular/core';
import { AngularDelegate, ConfigToken, ModalController, provideComponentInputBinding } from '@ionic/angular/common';
import { initialize } from '@ionic/core/components';
import type { IonicConfig } from '@ionic/core/components';

import { PopoverController } from './popover-controller';

export const provideIonicAngular = (config?: IonicConfig): Provider[] => {
  /**
   * TODO FW-4967
   * Use makeEnvironmentProviders once Angular 14 support is dropped.
   * This prevents provideIonicAngular from being accidentally referenced in an @Component.
   */
  return [
    {
      provide: ConfigToken,
      useValue: config,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeIonicAngular,
      multi: true,
      deps: [ConfigToken, DOCUMENT],
    },
    provideComponentInputBinding(),
    AngularDelegate,
    ModalController,
    PopoverController,
  ];
};

const initializeIonicAngular = (config: IonicConfig, doc: Document) => {
  return () => {
    /**
     * By default Ionic Framework hides elements that
     * are not hydrated, but in the CE build there is no
     * hydration.
     * TODO FW-2797: Remove when all integrations have been
     * migrated to CE build.
     */
    doc.documentElement.classList.add('ion-ce');

    initialize(config);
  };
};
