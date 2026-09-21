/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonToast } from '@ionic/core/components/ion-toast.js';

@ProxyCmp({
  defineCustomElementFn: defineIonToast,
  inputs: ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'htmlAttributes', 'hue', 'icon', 'isOpen', 'keyboardClose', 'layout', 'leaveAnimation', 'message', 'mode', 'position', 'positionAnchor', 'shape', 'swipeGesture', 'theme', 'translucent', 'trigger'],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
})
@Component({
  selector: 'ion-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['animated', 'buttons', 'color', 'cssClass', 'duration', 'enterAnimation', 'header', 'htmlAttributes', 'hue', 'icon', 'isOpen', 'keyboardClose', 'layout', 'leaveAnimation', 'message', 'mode', 'position', 'positionAnchor', 'shape', 'swipeGesture', 'theme', 'translucent', 'trigger'],
  outputs: ['ionToastDidPresent', 'ionToastWillPresent', 'ionToastWillDismiss', 'ionToastDidDismiss', 'didPresent', 'willPresent', 'willDismiss', 'didDismiss'],
})
export class IonToast {
  protected el: HTMLIonToastElement;
  @Output() ionToastDidPresent = new EventEmitter<IonToastCustomEvent<void>>();
  @Output() ionToastWillPresent = new EventEmitter<IonToastCustomEvent<void>>();
  @Output() ionToastWillDismiss = new EventEmitter<IonToastCustomEvent<IIonToastOverlayEventDetail>>();
  @Output() ionToastDidDismiss = new EventEmitter<IonToastCustomEvent<IIonToastOverlayEventDetail>>();
  @Output() didPresent = new EventEmitter<IonToastCustomEvent<void>>();
  @Output() willPresent = new EventEmitter<IonToastCustomEvent<void>>();
  @Output() willDismiss = new EventEmitter<IonToastCustomEvent<IIonToastOverlayEventDetail>>();
  @Output() didDismiss = new EventEmitter<IonToastCustomEvent<IIonToastOverlayEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonToastCustomEvent } from '@ionic/core/components';
import type { OverlayEventDetail as IIonToastOverlayEventDetail } from '@ionic/core/components';

export declare interface IonToast extends Components.IonToast {
  /**
   * Emitted after the toast has presented.
   */
  ionToastDidPresent: EventEmitter<IonToastCustomEvent<void>>;
  /**
   * Emitted before the toast has presented.
   */
  ionToastWillPresent: EventEmitter<IonToastCustomEvent<void>>;
  /**
   * Emitted before the toast has dismissed.
   */
  ionToastWillDismiss: EventEmitter<IonToastCustomEvent<IIonToastOverlayEventDetail>>;
  /**
   * Emitted after the toast has dismissed.
   */
  ionToastDidDismiss: EventEmitter<IonToastCustomEvent<IIonToastOverlayEventDetail>>;
  /**
   * Emitted after the toast has presented.
Shorthand for ionToastWillDismiss.
   */
  didPresent: EventEmitter<IonToastCustomEvent<void>>;
  /**
   * Emitted before the toast has presented.
Shorthand for ionToastWillPresent.
   */
  willPresent: EventEmitter<IonToastCustomEvent<void>>;
  /**
   * Emitted before the toast has dismissed.
Shorthand for ionToastWillDismiss.
   */
  willDismiss: EventEmitter<IonToastCustomEvent<IIonToastOverlayEventDetail>>;
  /**
   * Emitted after the toast has dismissed.
Shorthand for ionToastDidDismiss.
   */
  didDismiss: EventEmitter<IonToastCustomEvent<IIonToastOverlayEventDetail>>;
}


