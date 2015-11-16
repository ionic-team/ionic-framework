import {Component, ElementRef, DynamicComponentLoader} from 'angular2/angular2';

import {OverlayController} from './overlay-controller';


/**
 * @private
 */
@Component({
  selector: 'ion-overlay',
  template: '<template #contents></template>'
})
export class OverlayAnchor {
  constructor(
    overlayCtrl: OverlayController,
    elementRef: ElementRef,
    loader: DynamicComponentLoader
  ) {
    if (overlayCtrl.anchor) {
      throw ('An app should only have one <ion-overlay></ion-overlay>');
    }

    this.elementRef = elementRef;
    this.loader = loader;
    overlayCtrl.anchor = this;
  }

  append(componentType) {
    return this.loader.loadIntoLocation(componentType, this.elementRef, 'contents').catch(err => {
      console.error(err);
    });
  }
}
