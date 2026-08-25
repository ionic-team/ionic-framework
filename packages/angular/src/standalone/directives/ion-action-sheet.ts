/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/dist/types/components';

import { defineCustomElement as defineIonActionSheet } from '@ionic/core/components/ion-action-sheet.js';

@ProxyCmp({
  defineCustomElementFn: defineIonActionSheet,
  inputs: ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'translucent', 'trigger'],
  methods: ['present', 'dismiss', 'onDidDismiss', 'onWillDismiss']
})
@Component({
  selector: 'ion-action-sheet',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['animated', 'backdropDismiss', 'buttons', 'cssClass', 'enterAnimation', 'header', 'htmlAttributes', 'isOpen', 'keyboardClose', 'leaveAnimation', 'mode', 'subHeader', 'translucent', 'trigger'],
  outputs: ['ionActionSheetDidPresent', 'ionActionSheetWillPresent', 'ionActionSheetWillDismiss', 'ionActionSheetDidDismiss', 'didPresent', 'willPresent', 'willDismiss', 'didDismiss'],
})
export class IonActionSheet {
  protected el: HTMLIonActionSheetElement;
  @Output() ionActionSheetDidPresent = new EventEmitter<IonActionSheetCustomEvent<void>>();
  @Output() ionActionSheetWillPresent = new EventEmitter<IonActionSheetCustomEvent<void>>();
  @Output() ionActionSheetWillDismiss = new EventEmitter<IonActionSheetCustomEvent<IIonActionSheetOverlayEventDetail>>();
  @Output() ionActionSheetDidDismiss = new EventEmitter<IonActionSheetCustomEvent<IIonActionSheetOverlayEventDetail>>();
  @Output() didPresent = new EventEmitter<IonActionSheetCustomEvent<void>>();
  @Output() willPresent = new EventEmitter<IonActionSheetCustomEvent<void>>();
  @Output() willDismiss = new EventEmitter<IonActionSheetCustomEvent<IIonActionSheetOverlayEventDetail>>();
  @Output() didDismiss = new EventEmitter<IonActionSheetCustomEvent<IIonActionSheetOverlayEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonActionSheetCustomEvent } from '@ionic/core/components';
import type { OverlayEventDetail as IIonActionSheetOverlayEventDetail } from '@ionic/core/components';

export declare interface IonActionSheet extends Components.IonActionSheet {
  /**
   * Emitted after the action sheet has presented.
   */
  ionActionSheetDidPresent: EventEmitter<IonActionSheetCustomEvent<void>>;
  /**
   * Emitted before the action sheet has presented.
   */
  ionActionSheetWillPresent: EventEmitter<IonActionSheetCustomEvent<void>>;
  /**
   * Emitted before the action sheet has dismissed.
   */
  ionActionSheetWillDismiss: EventEmitter<IonActionSheetCustomEvent<IIonActionSheetOverlayEventDetail>>;
  /**
   * Emitted after the action sheet has dismissed.
   */
  ionActionSheetDidDismiss: EventEmitter<IonActionSheetCustomEvent<IIonActionSheetOverlayEventDetail>>;
  /**
   * Emitted after the action sheet has presented.
Shorthand for ionActionSheetWillDismiss.
   */
  didPresent: EventEmitter<IonActionSheetCustomEvent<void>>;
  /**
   * Emitted before the action sheet has presented.
Shorthand for ionActionSheetWillPresent.
   */
  willPresent: EventEmitter<IonActionSheetCustomEvent<void>>;
  /**
   * Emitted before the action sheet has dismissed.
Shorthand for ionActionSheetWillDismiss.
   */
  willDismiss: EventEmitter<IonActionSheetCustomEvent<IIonActionSheetOverlayEventDetail>>;
  /**
   * Emitted after the action sheet has dismissed.
Shorthand for ionActionSheetDidDismiss.
   */
  didDismiss: EventEmitter<IonActionSheetCustomEvent<IIonActionSheetOverlayEventDetail>>;
}


