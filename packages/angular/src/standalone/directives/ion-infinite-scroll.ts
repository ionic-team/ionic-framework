/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonInfiniteScroll } from '@ionic/core/components/ion-infinite-scroll.js';

@ProxyCmp({
  defineCustomElementFn: defineIonInfiniteScroll,
  inputs: ['disabled', 'position', 'threshold'],
  methods: ['complete']
})
@Component({
  selector: 'ion-infinite-scroll',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled', 'position', 'threshold'],
  outputs: ['ionInfinite'],
})
export class IonInfiniteScroll {
  protected el: HTMLIonInfiniteScrollElement;
  @Output() ionInfinite = new EventEmitter<IonInfiniteScrollCustomEvent<void>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonInfiniteScrollCustomEvent } from '@ionic/core/components';

export declare interface IonInfiniteScroll extends Components.IonInfiniteScroll {
  /**
   * Emitted when the scroll reaches
the threshold distance. From within your infinite handler,
you must call the infinite scroll's `complete()` method when
your async operation has completed.
   */
  ionInfinite: EventEmitter<IonInfiniteScrollCustomEvent<void>>;
}


