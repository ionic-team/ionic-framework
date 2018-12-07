import { LoadingOptions } from '@ionic/core';
import { OverlayBaseController } from '../util';

export class LoadingController extends OverlayBaseController<LoadingOptions, HTMLIonLoadingElement> {
  constructor() {
    super('ion-loading-controller');
  }
}
