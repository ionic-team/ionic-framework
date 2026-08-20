/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonSelectModal } from '@ionic/core/components/ion-select-modal.js';

@ProxyCmp({
  defineCustomElementFn: defineIonSelectModal,
  inputs: ['cancelText', 'header', 'multiple', 'options']
})
@Component({
  selector: 'ion-select-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['cancelText', 'header', 'multiple', 'options'],
})
export class IonSelectModal {
  protected el: HTMLIonSelectModalElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface IonSelectModal extends Components.IonSelectModal {}


