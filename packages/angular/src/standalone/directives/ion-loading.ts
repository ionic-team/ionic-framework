/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonLoading } from '@ionic/core/components/ion-loading.js';

@ProxyCmp({
  defineCustomElementFn: defineIonLoading,
  inputs: ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'theme', 'translucent', 'trigger'],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
})
@Component({
  selector: 'ion-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['animated', 'backdropDismiss', 'cssClass', 'duration', 'enterAnimation', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'showBackdrop', 'spinner', 'theme', 'translucent', 'trigger'],
  outputs: ['ionLoadingDidPresent', 'ionLoadingWillPresent', 'ionLoadingWillDismiss', 'ionLoadingDidDismiss', 'didPresent', 'willPresent', 'willDismiss', 'didDismiss'],
})
export class IonLoading {
  protected el: HTMLIonLoadingElement;
  @Output() ionLoadingDidPresent = new EventEmitter<IonLoadingCustomEvent<void>>();
  @Output() ionLoadingWillPresent = new EventEmitter<IonLoadingCustomEvent<void>>();
  @Output() ionLoadingWillDismiss = new EventEmitter<IonLoadingCustomEvent<IIonLoadingOverlayEventDetail>>();
  @Output() ionLoadingDidDismiss = new EventEmitter<IonLoadingCustomEvent<IIonLoadingOverlayEventDetail>>();
  @Output() didPresent = new EventEmitter<IonLoadingCustomEvent<void>>();
  @Output() willPresent = new EventEmitter<IonLoadingCustomEvent<void>>();
  @Output() willDismiss = new EventEmitter<IonLoadingCustomEvent<IIonLoadingOverlayEventDetail>>();
  @Output() didDismiss = new EventEmitter<IonLoadingCustomEvent<IIonLoadingOverlayEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonLoadingCustomEvent } from '@ionic/core/components';
import type { OverlayEventDetail as IIonLoadingOverlayEventDetail } from '@ionic/core/components';

export declare interface IonLoading extends Components.IonLoading {
  /**
   * Emitted after the loading has presented.
   */
  ionLoadingDidPresent: EventEmitter<IonLoadingCustomEvent<void>>;
  /**
   * Emitted before the loading has presented.
   */
  ionLoadingWillPresent: EventEmitter<IonLoadingCustomEvent<void>>;
  /**
   * Emitted before the loading has dismissed.
   */
  ionLoadingWillDismiss: EventEmitter<IonLoadingCustomEvent<IIonLoadingOverlayEventDetail>>;
  /**
   * Emitted after the loading has dismissed.
   */
  ionLoadingDidDismiss: EventEmitter<IonLoadingCustomEvent<IIonLoadingOverlayEventDetail>>;
  /**
   * Emitted after the loading indicator has presented.
Shorthand for ionLoadingWillDismiss.
   */
  didPresent: EventEmitter<IonLoadingCustomEvent<void>>;
  /**
   * Emitted before the loading indicator has presented.
Shorthand for ionLoadingWillPresent.
   */
  willPresent: EventEmitter<IonLoadingCustomEvent<void>>;
  /**
   * Emitted before the loading indicator has dismissed.
Shorthand for ionLoadingWillDismiss.
   */
  willDismiss: EventEmitter<IonLoadingCustomEvent<IIonLoadingOverlayEventDetail>>;
  /**
   * Emitted after the loading indicator has dismissed.
Shorthand for ionLoadingDidDismiss.
   */
  didDismiss: EventEmitter<IonLoadingCustomEvent<IIonLoadingOverlayEventDetail>>;
}


