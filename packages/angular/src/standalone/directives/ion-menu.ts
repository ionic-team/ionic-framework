/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonMenu } from '@ionic/core/components/ion-menu.js';

@ProxyCmp({
  defineCustomElementFn: defineIonMenu,
  inputs: ['contentId', 'disabled', 'maxEdgeStart', 'menuId', 'mode', 'side', 'swipeGesture', 'theme', 'type'],
  methods: ['isOpen', 'isActive', 'open', 'close', 'toggle', 'setOpen']
})
@Component({
  selector: 'ion-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['contentId', 'disabled', 'maxEdgeStart', 'menuId', 'mode', 'side', 'swipeGesture', 'theme', 'type'],
  outputs: ['ionWillOpen', 'ionWillClose', 'ionDidOpen', 'ionDidClose'],
})
export class IonMenu {
  protected el: HTMLIonMenuElement;
  @Output() ionWillOpen = new EventEmitter<IonMenuCustomEvent<void>>();
  @Output() ionWillClose = new EventEmitter<IonMenuCustomEvent<IIonMenuMenuCloseEventDetail>>();
  @Output() ionDidOpen = new EventEmitter<IonMenuCustomEvent<void>>();
  @Output() ionDidClose = new EventEmitter<IonMenuCustomEvent<IIonMenuMenuCloseEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonMenuCustomEvent } from '@ionic/core/components';
import type { MenuCloseEventDetail as IIonMenuMenuCloseEventDetail } from '@ionic/core/components';

export declare interface IonMenu extends Components.IonMenu {
  /**
   * Emitted when the menu is about to be opened.
   */
  ionWillOpen: EventEmitter<IonMenuCustomEvent<void>>;
  /**
   * Emitted when the menu is about to be closed.
   */
  ionWillClose: EventEmitter<IonMenuCustomEvent<IIonMenuMenuCloseEventDetail>>;
  /**
   * Emitted when the menu is open.
   */
  ionDidOpen: EventEmitter<IonMenuCustomEvent<void>>;
  /**
   * Emitted when the menu is closed.
   */
  ionDidClose: EventEmitter<IonMenuCustomEvent<IIonMenuMenuCloseEventDetail>>;
}


