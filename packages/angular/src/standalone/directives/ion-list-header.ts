/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonListHeader } from '@ionic/core/components/ion-list-header.js';

@ProxyCmp({
  defineCustomElementFn: defineIonListHeader,
  inputs: ['color', 'lines', 'mode']
})
@Component({
  selector: 'ion-list-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'lines', 'mode'],
})
export class IonListHeader {
  protected el: HTMLIonListHeaderElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonListHeader extends Components.IonListHeader {}


