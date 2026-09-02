/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonSpinner } from '@ionic/core/components/ion-spinner.js';

@ProxyCmp({
  defineCustomElementFn: defineIonSpinner,
  inputs: ['color', 'duration', 'mode', 'name', 'paused', 'size', 'theme']
})
@Component({
  selector: 'ion-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'duration', 'mode', 'name', 'paused', 'size', 'theme'],
})
export class IonSpinner {
  protected el: HTMLIonSpinnerElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSpinner extends Components.IonSpinner {}


