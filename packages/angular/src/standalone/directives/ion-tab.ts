/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/dist/types/components';

import { defineCustomElement as defineIonTab } from '@ionic/core/components/ion-tab.js';

@ProxyCmp({
  defineCustomElementFn: defineIonTab,
  inputs: ['component', 'tab'],
  methods: ['setActive']
})
@Component({
  selector: 'ion-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['component', { name: 'tab', required: true }],
})
export class IonTab {
  protected el: HTMLIonTabElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonTab extends Components.IonTab {}


