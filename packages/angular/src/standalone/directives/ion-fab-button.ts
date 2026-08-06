/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonFabButton } from '@ionic/core/components/ion-fab-button.js';

@ProxyCmp({
  defineCustomElementFn: defineIonFabButton,
  inputs: ['activated', 'closeIcon', 'color', 'disabled', 'download', 'form', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'show', 'size', 'target', 'translucent', 'type']
})
@Component({
  selector: 'ion-fab-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['activated', 'closeIcon', 'color', 'disabled', 'download', 'form', 'href', 'mode', 'rel', 'routerAnimation', 'routerDirection', 'show', 'size', 'target', 'translucent', 'type'],
  outputs: ['ionFocus', 'ionBlur'],
})
export class IonFabButton {
  protected el: HTMLIonFabButtonElement;
  @Output() ionFocus = new EventEmitter<IonFabButtonCustomEvent<void>>();
  @Output() ionBlur = new EventEmitter<IonFabButtonCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonFabButtonCustomEvent } from '@ionic/core/components';

export declare interface IonFabButton extends Components.IonFabButton {
  /**
   * Emitted when the button has focus.
   */
  ionFocus: EventEmitter<IonFabButtonCustomEvent<void>>;
  /**
   * Emitted when the button loses focus.
   */
  ionBlur: EventEmitter<IonFabButtonCustomEvent<void>>;
}


