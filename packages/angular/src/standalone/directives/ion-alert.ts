/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonAlert } from '@ionic/core/components/ion-alert.js';

@ProxyCmp({
  defineCustomElementFn: defineIonAlert,
  inputs: ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'inputs', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'theme', 'translucent', 'trigger'],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
})
@Component({
  selector: 'ion-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'inputs', 'isOpen', 'keyboardClose', 'leaveAnimation', 'message', 'mode', 'subHeader', 'theme', 'translucent', 'trigger'],
  outputs: ['ionAlertDidPresent', 'ionAlertWillPresent', 'ionAlertWillDismiss', 'ionAlertDidDismiss', 'didPresent', 'willPresent', 'willDismiss', 'didDismiss'],
})
export class IonAlert {
  protected el: HTMLIonAlertElement;
  @Output() ionAlertDidPresent = new EventEmitter<IonAlertCustomEvent<void>>();
  @Output() ionAlertWillPresent = new EventEmitter<IonAlertCustomEvent<void>>();
  @Output() ionAlertWillDismiss = new EventEmitter<IonAlertCustomEvent<IIonAlertOverlayEventDetail>>();
  @Output() ionAlertDidDismiss = new EventEmitter<IonAlertCustomEvent<IIonAlertOverlayEventDetail>>();
  @Output() didPresent = new EventEmitter<IonAlertCustomEvent<void>>();
  @Output() willPresent = new EventEmitter<IonAlertCustomEvent<void>>();
  @Output() willDismiss = new EventEmitter<IonAlertCustomEvent<IIonAlertOverlayEventDetail>>();
  @Output() didDismiss = new EventEmitter<IonAlertCustomEvent<IIonAlertOverlayEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonAlertCustomEvent } from '@ionic/core/components';
import type { OverlayEventDetail as IIonAlertOverlayEventDetail } from '@ionic/core/components';

export declare interface IonAlert extends Components.IonAlert {
  /**
   * Emitted after the alert has presented.
   */
  ionAlertDidPresent: EventEmitter<IonAlertCustomEvent<void>>;
  /**
   * Emitted before the alert has presented.
   */
  ionAlertWillPresent: EventEmitter<IonAlertCustomEvent<void>>;
  /**
   * Emitted before the alert has dismissed.
   */
  ionAlertWillDismiss: EventEmitter<IonAlertCustomEvent<IIonAlertOverlayEventDetail>>;
  /**
   * Emitted after the alert has dismissed.
   */
  ionAlertDidDismiss: EventEmitter<IonAlertCustomEvent<IIonAlertOverlayEventDetail>>;
  /**
   * Emitted after the alert has presented.
Shorthand for ionAlertWillDismiss.
   */
  didPresent: EventEmitter<IonAlertCustomEvent<void>>;
  /**
   * Emitted before the alert has presented.
Shorthand for ionAlertWillPresent.
   */
  willPresent: EventEmitter<IonAlertCustomEvent<void>>;
  /**
   * Emitted before the alert has dismissed.
Shorthand for ionAlertWillDismiss.
   */
  willDismiss: EventEmitter<IonAlertCustomEvent<IIonAlertOverlayEventDetail>>;
  /**
   * Emitted after the alert has dismissed.
Shorthand for ionAlertDidDismiss.
   */
  didDismiss: EventEmitter<IonAlertCustomEvent<IIonAlertOverlayEventDetail>>;
}


