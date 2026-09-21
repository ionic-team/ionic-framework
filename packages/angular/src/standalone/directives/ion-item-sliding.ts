/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonItemSliding } from '@ionic/core/components/ion-item-sliding.js';

@ProxyCmp({
  defineCustomElementFn: defineIonItemSliding,
  inputs: ['disabled', 'mode', 'theme'],
  methods: ['getOpenAmount', 'getSlidingRatio', 'open', 'close', 'closeOpened']
})
@Component({
  selector: 'ion-item-sliding',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'mode', 'theme'],
  outputs: ['ionDrag'],
})
export class IonItemSliding {
  protected el: HTMLIonItemSlidingElement;
  @Output() ionDrag = new EventEmitter<IonItemSlidingCustomEvent<any>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonItemSlidingCustomEvent } from '@ionic/core/components';

export declare interface IonItemSliding extends Components.IonItemSliding {
  /**
   * Emitted when the sliding position changes.
   */
  ionDrag: EventEmitter<IonItemSlidingCustomEvent<any>>;
}


