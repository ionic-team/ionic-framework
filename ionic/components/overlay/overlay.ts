import {Component, View, ElementRef, DynamicComponentLoader} from 'angular2/angular2';

import {OverlayController} from './overlay-controller';


@Component({
  selector: 'ion-overlay'
})
@View({
  template: ''
})
export class OverlayAnchor {
  constructor(
    overlayCtrl: OverlayController,
    elementRef: ElementRef,
    loader: DynamicComponentLoader
  ) {
    if (overlayCtrl.anchor) {
      throw ('An app should only have one <ion-overlays></ion-overlays>');
    }

    this.elementRef = elementRef;
    this.loader = loader;
    overlayCtrl.anchor = this;
  }

  append(componentType) {
    return this.loader.loadNextToLocation(componentType, this.elementRef).catch(err => {
      console.error(err);
    });
  }
}
