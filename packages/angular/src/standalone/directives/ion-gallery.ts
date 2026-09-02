/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonGallery } from '@ionic/core/components/ion-gallery.js';

@ProxyCmp({
  defineCustomElementFn: defineIonGallery,
  inputs: ['columns', 'gap', 'layout', 'mode', 'order', 'theme']
})
@Component({
  selector: 'ion-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['columns', 'gap', 'layout', 'mode', 'order', 'theme'],
})
export class IonGallery {
  protected el: HTMLIonGalleryElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonGallery extends Components.IonGallery {}
