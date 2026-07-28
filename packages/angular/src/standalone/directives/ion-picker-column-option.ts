/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonPickerColumnOption } from '@ionic/core/components/ion-picker-column-option.js';

@ProxyCmp({
  defineCustomElementFn: defineIonPickerColumnOption,
  inputs: ['color', 'disabled', 'value']
})
@Component({
  selector: 'ion-picker-column-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'disabled', 'value'],
})
export class IonPickerColumnOption {
  protected el: HTMLIonPickerColumnOptionElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonPickerColumnOption extends Components.IonPickerColumnOption {}


