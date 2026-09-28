/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonDatetimeButton } from '@ionic/core/components/ion-datetime-button.js';

@ProxyCmp({
  defineCustomElementFn: defineIonDatetimeButton,
  inputs: ['color', 'datetime', 'disabled', 'mode', 'theme']
})
@Component({
  selector: 'ion-datetime-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'datetime', 'disabled', 'mode', 'theme'],
})
export class IonDatetimeButton {
  protected el: HTMLIonDatetimeButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonDatetimeButton extends Components.IonDatetimeButton {}


