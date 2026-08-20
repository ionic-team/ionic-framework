/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonContent } from '@ionic/core/components/ion-content.js';

@ProxyCmp({
  defineCustomElementFn: defineIonContent,
  inputs: ['color', 'fixedSlotPlacement', 'forceOverscroll', 'fullscreen', 'scrollEvents', 'scrollX', 'scrollY'],
  methods: ['getScrollElement', 'scrollToTop', 'scrollToBottom', 'scrollByPoint', 'scrollToPoint']
})
@Component({
  selector: 'ion-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'fixedSlotPlacement', 'forceOverscroll', 'fullscreen', 'scrollEvents', 'scrollX', 'scrollY'],
  outputs: ['ionScrollStart', 'ionScroll', 'ionScrollEnd'],
})
export class IonContent {
  protected el: HTMLIonContentElement;
  @Output() ionScrollStart = new EventEmitter<IonContentCustomEvent<IIonContentScrollBaseDetail>>();
  @Output() ionScroll = new EventEmitter<IonContentCustomEvent<IIonContentScrollDetail>>();
  @Output() ionScrollEnd = new EventEmitter<IonContentCustomEvent<IIonContentScrollBaseDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonContentCustomEvent } from '@ionic/core/components';
import type { ScrollBaseDetail as IIonContentScrollBaseDetail } from '@ionic/core/components';
import type { ScrollDetail as IIonContentScrollDetail } from '@ionic/core/components';

export declare interface IonContent extends Components.IonContent {
  /**
   * Emitted when the scroll has started. This event is disabled by default.
Set `scrollEvents` to `true` to enable.
   */
  ionScrollStart: EventEmitter<IonContentCustomEvent<IIonContentScrollBaseDetail>>;
  /**
   * Emitted while scrolling. This event is disabled by default.
Set `scrollEvents` to `true` to enable.
   */
  ionScroll: EventEmitter<IonContentCustomEvent<IIonContentScrollDetail>>;
  /**
   * Emitted when the scroll has ended. This event is disabled by default.
Set `scrollEvents` to `true` to enable.
   */
  ionScrollEnd: EventEmitter<IonContentCustomEvent<IIonContentScrollBaseDetail>>;
}


