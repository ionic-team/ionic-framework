import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, makeEnvironmentProviders } from '@angular/core';
import type { EnvironmentProviders } from '@angular/core';
import { AngularDelegate, ConfigToken, provideComponentInputBinding } from '@ionic/angular/common';
import { initialize } from '@ionic/core/components';
import type { IonicConfig } from '@ionic/core/components';

import { ModalController } from './modal-controller';
import { PopoverController } from './popover-controller';

export const provideIonicAngular = (config?: IonicConfig): EnvironmentProviders => {
  return makeEnvironmentProviders([
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
  ]);
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
