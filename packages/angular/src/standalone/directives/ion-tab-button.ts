/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';
import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonTabButton } from '@ionic/core/components/ion-tab-button.js';

@ProxyCmp({
  defineCustomElementFn: defineIonTabButton,
  inputs: ['disabled', 'download', 'href', 'layout', 'mode', 'rel', 'selected', 'tab', 'target']
})
@Component({
  selector: 'ion-tab-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [{ name: 'disabled', transform: nullableBooleanAttribute }, 'download', 'href', 'layout', 'mode', 'rel', { name: 'selected', transform: nullableBooleanAttribute }, 'tab', 'target'],
})
export class IonTabButton {
  protected el: HTMLIonTabButtonElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonTabButton extends Components.IonTabButton {}


