/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/dist/types/components';

import { defineCustomElement as defineIonItemDivider } from '@ionic/core/components/ion-item-divider.js';

@ProxyCmp({
  defineCustomElementFn: defineIonItemDivider,
  inputs: ['color', 'mode', 'sticky']
})
@Component({
  selector: 'ion-item-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'mode', 'sticky'],
})
export class IonItemDivider {
  protected el: HTMLIonItemDividerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonItemDivider extends Components.IonItemDivider {}


