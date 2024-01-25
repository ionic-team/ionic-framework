import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { LoadingOptions } from '@ionic/core/components';
import { loadingController } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-loading.js';

@Injectable({
  providedIn: 'root',
})
export class LoadingController extends OverlayBaseController<LoadingOptions, HTMLIonLoadingElement> {
  constructor() {
    super(loadingController);
    defineCustomElement();
  }
}
