/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonChip } from '@ionic/core/components/ion-chip.js';

@ProxyCmp({
  defineCustomElementFn: defineIonChip,
  inputs: ['color', 'disabled', 'hue', 'mode', 'outline', 'shape', 'size', 'theme']
})
@Component({
  selector: 'ion-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'disabled', 'hue', 'mode', 'outline', 'shape', 'size', 'theme'],
})
export class IonChip {
  protected el: HTMLIonChipElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonChip extends Components.IonChip {}


