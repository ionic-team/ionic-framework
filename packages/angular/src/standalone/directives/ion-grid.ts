/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';
import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonGrid } from '@ionic/core/components/ion-grid.js';

@ProxyCmp({
  defineCustomElementFn: defineIonGrid,
  inputs: ['fixed']
})
@Component({
  selector: 'ion-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [{ name: 'fixed', transform: nullableBooleanAttribute }],
})
export class IonGrid {
  protected el: HTMLIonGridElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonGrid extends Components.IonGrid {}


