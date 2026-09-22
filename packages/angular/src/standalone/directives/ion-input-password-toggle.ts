/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonInputPasswordToggle } from '@ionic/core/components/ion-input-password-toggle.js';

@ProxyCmp({
  defineCustomElementFn: defineIonInputPasswordToggle,
  inputs: ['color', 'hideIcon', 'mode', 'showIcon']
})
@Component({
  selector: 'ion-input-password-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'hideIcon', 'mode', 'showIcon'],
})
export class IonInputPasswordToggle {
  protected el: HTMLIonInputPasswordToggleElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonInputPasswordToggle extends Components.IonInputPasswordToggle {}


