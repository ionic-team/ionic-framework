/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonSegmentView } from '@ionic/core/components/ion-segment-view.js';

@ProxyCmp({
  defineCustomElementFn: defineIonSegmentView,
  inputs: ['disabled', 'swipeGesture']
})
@Component({
  selector: 'ion-segment-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'swipeGesture'],
  outputs: ['ionSegmentViewScroll'],
})
export class IonSegmentView {
  protected el: HTMLIonSegmentViewElement;
  @Output() ionSegmentViewScroll = new EventEmitter<IonSegmentViewCustomEvent<IIonSegmentViewSegmentViewScrollEvent>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonSegmentViewCustomEvent } from '@ionic/core/components';
import type { SegmentViewScrollEvent as IIonSegmentViewSegmentViewScrollEvent } from '@ionic/core/components';

export declare interface IonSegmentView extends Components.IonSegmentView {
  /**
   * Emitted when the segment view is scrolled.
   */
  ionSegmentViewScroll: EventEmitter<IonSegmentViewCustomEvent<IIonSegmentViewSegmentViewScrollEvent>>;
}


