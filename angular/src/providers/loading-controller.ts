import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { LoadingOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class LoadingController extends OverlayBaseController<LoadingOptions, HTMLIonLoadingElement> {
  constructor(@Inject(DOCUMENT) doc: any) {
    super('ion-loading-controller', doc);
  }
}
