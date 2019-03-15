import { DOCUMENT } from '@angular/common';
import { APP_ID, NgModule } from '@angular/core';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
// import { hydrateDocumentSync } from '@ionic/core/hydrate';

// @dynamic
@NgModule({
  providers: [
    {
      provide: BEFORE_APP_SERIALIZED,
      useFactory: hydrateIonicComponents,
      multi: true,
      deps: [DOCUMENT, APP_ID]
    }
  ]
})
export class IonicHydrateModule {}

// @dynamic
export function hydrateIonicComponents(doc: any, appId: any) {
  return () => {
    // hydrateDocumentSync(doc, {
    //   clientSideHydrate: false,
    //   collapseWhitespace: false,
    //   collectAnchors: false,
    //   collectComponents: false,
    //   collectImgs: false,
    //   collectScripts: false,
    //   collectStylesheets: false
    // });

    const styleElms = doc.head.querySelectorAll('style[data-styles]');
    for (let i = 0; i < styleElms.length; i++) {
      styleElms[i].setAttribute('ng-transition', appId);
    }
  };
}
