import { DOCUMENT } from '@angular/common';
import { APP_ID, NgModule } from '@angular/core';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { hydrateDocument } from '@ionic/core/hydrate';

// @dynamic
@NgModule({
  providers: [
    {
      provide: BEFORE_APP_SERIALIZED,
      useFactory: hydrateIonicComponents,
      multi: true,
      deps: [DOCUMENT, APP_ID],
    },
  ],
})
export class IonicServerModule {}

// @dynamic
export function hydrateIonicComponents(doc: any, appId: any) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return () => {
    return hydrateDocument(doc, {
      clientHydrateAnnotations: false,
      excludeComponents: [
        // overlays
        'ion-action-sheet',
        'ion-alert',
        'ion-loading',
        'ion-modal',
        'ion-picker-legacy',
        'ion-popover',
        'ion-toast',
        'ion-toast',

        // navigation
        'ion-router',
        'ion-route',
        'ion-route-redirect',
        'ion-router-link',
        'ion-router-outlet',

        // tabs
        'ion-tabs',
        'ion-tab',

        // auxiliar
        'ion-picker-legacy-column',
      ],
    }).then((hydrateResults) => {
      hydrateResults.diagnostics.forEach((d) => {
        if (d.type === 'error') {
          console.error(d.messageText);
        } else if (d.type === 'debug') {
          console.debug(d.messageText);
        } else {
          console.log(d.messageText);
        }
      });

      if (doc.head != null) {
        const styleElms = doc.head.querySelectorAll('style[data-styles]') as NodeListOf<HTMLStyleElement>;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < styleElms.length; i++) {
          styleElms[i].setAttribute('ng-transition', appId);
        }
      }

      if (doc.body != null) {
        const ionPages = doc.body.querySelectorAll('.ion-page.ion-page-invisible') as NodeListOf<HTMLElement>;
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < ionPages.length; i++) {
          ionPages[i].classList.remove('ion-page-invisible');
        }
      }
    });
  };
}
