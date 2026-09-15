/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';
import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonBackdrop } from '@ionic/core/components/ion-backdrop.js';

@ProxyCmp({
  defineCustomElementFn: defineIonBackdrop,
  inputs: ['stopPropagation', 'tappable', 'visible']
})
@Component({
  selector: 'ion-backdrop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: [{ name: 'stopPropagation', transform: nullableBooleanAttribute }, { name: 'tappable', transform: nullableBooleanAttribute }, { name: 'visible', transform: nullableBooleanAttribute }],
  outputs: ['ionBackdropTap'],
})
export class IonBackdrop {
  protected el: HTMLIonBackdropElement;
  @Output() ionBackdropTap = new EventEmitter<IonBackdropCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonBackdropCustomEvent } from '@ionic/core/components';

export declare interface IonBackdrop extends Components.IonBackdrop {
  /**
   * Emitted when the backdrop is tapped.
   */
  ionBackdropTap: EventEmitter<IonBackdropCustomEvent<void>>;
}


