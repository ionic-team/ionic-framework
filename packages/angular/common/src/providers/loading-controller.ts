import { Injectable } from '@angular/core';
import type { LoadingOptions } from '@ionic/core/components';
import { loadingController } from '@ionic/core/components';

import { OverlayBaseController } from '../utils/overlay';

@Injectable({
  providedIn: 'root',
})
export class LoadingController extends OverlayBaseController<LoadingOptions, HTMLIonLoadingElement> {
  constructor() {
    super(loadingController);
  }
}
