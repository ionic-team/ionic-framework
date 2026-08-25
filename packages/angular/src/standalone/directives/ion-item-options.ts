/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonItemOptions } from '@ionic/core/components/ion-item-options.js';

@ProxyCmp({
  defineCustomElementFn: defineIonItemOptions,
  inputs: ['side']
})
@Component({
  selector: 'ion-item-options',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side'],
  outputs: ['ionSwipe'],
})
export class IonItemOptions {
  protected el: HTMLIonItemOptionsElement;
  @Output() ionSwipe = new EventEmitter<IonItemOptionsCustomEvent<any>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonItemOptionsCustomEvent } from '@ionic/core/components';

export declare interface IonItemOptions extends Components.IonItemOptions {
  /**
   * Emitted when the item has been fully swiped.
   */
  ionSwipe: EventEmitter<IonItemOptionsCustomEvent<any>>;
}


