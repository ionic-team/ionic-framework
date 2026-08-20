/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonButton } from '@ionic/core/components/ion-button.js';

@ProxyCmp({
  defineCustomElementFn: defineIonButton,
  inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'form', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'size', 'strong', 'target', 'type']
})
@Component({
  selector: 'ion-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['buttonType', 'color', 'disabled', 'download', 'expand', 'fill', 'form', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'shape', 'size', 'strong', 'target', 'type'],
  outputs: ['ionFocus', 'ionBlur'],
})
export class IonButton {
  protected el: HTMLIonButtonElement;
  @Output() ionFocus = new EventEmitter<IonButtonCustomEvent<void>>();
  @Output() ionBlur = new EventEmitter<IonButtonCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonButtonCustomEvent } from '@ionic/core/components';

export declare interface IonButton extends Components.IonButton {
  /**
   * Emitted when the button has focus.
   */
  ionFocus: EventEmitter<IonButtonCustomEvent<void>>;
  /**
   * Emitted when the button loses focus.
   */
  ionBlur: EventEmitter<IonButtonCustomEvent<void>>;
}


