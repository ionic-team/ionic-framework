import { Injectable } from '@angular/core';
import { LoadingOptions } from '@ionic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable()
export class LoadingController extends OverlayBaseController<LoadingOptions, HTMLIonLoadingElement> {
  constructor() {
    super('ion-loading-controller');
  }
}
