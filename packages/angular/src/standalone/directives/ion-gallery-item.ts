/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonGalleryItem } from '@ionic/core/components/ion-gallery-item.js';

@ProxyCmp({
  defineCustomElementFn: defineIonGalleryItem,
  inputs: ['mode', 'theme']
})
@Component({
  selector: 'ion-gallery-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['mode', 'theme'],
})
export class IonGalleryItem {
  protected el: HTMLIonGalleryItemElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonGalleryItem extends Components.IonGalleryItem {}


