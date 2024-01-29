import { Injectable } from '@angular/core';
import { OverlayBaseController } from '@ionic/angular/common';
import type { LoadingOptions } from '@ionic/core';
import { loadingController } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingController extends OverlayBaseController<LoadingOptions, HTMLIonLoadingElement> {
  constructor() {
    super(loadingController);
  }
}
