/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';
import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonAccordion } from '@ionic/core/components/ion-accordion.js';

@ProxyCmp({
  defineCustomElementFn: defineIonAccordion,
  inputs: ['disabled', 'mode', 'readonly', 'toggleIcon', 'toggleIconSlot', 'value']
})
@Component({
  selector: 'ion-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [{ name: 'disabled', transform: nullableBooleanAttribute }, 'mode', { name: 'readonly', transform: nullableBooleanAttribute }, 'toggleIcon', 'toggleIconSlot', 'value'],
})
export class IonAccordion {
  protected el: HTMLIonAccordionElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonAccordion extends Components.IonAccordion {}


