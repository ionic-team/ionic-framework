/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/dist/types/components';

import { defineCustomElement as defineIonList } from '@ionic/core/components/ion-list.js';

@ProxyCmp({
  defineCustomElementFn: defineIonList,
  inputs: ['inset', 'lines', 'mode'],
  methods: ['closeSlidingItems']
})
@Component({
  selector: 'ion-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['inset', 'lines', 'mode'],
})
export class IonList {
  protected el: HTMLIonListElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonList extends Components.IonList {}


