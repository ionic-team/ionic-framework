/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonRefresher } from '@ionic/core/components/ion-refresher.js';

@ProxyCmp({
  defineCustomElementFn: defineIonRefresher,
  inputs: ['closeDuration', 'disabled', 'mode', 'pullFactor', 'pullMax', 'pullMin', 'snapbackDuration', 'theme'],
  methods: ['complete', 'cancel', 'getProgress']
})
@Component({
  selector: 'ion-refresher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['closeDuration', 'disabled', 'mode', 'pullFactor', 'pullMax', 'pullMin', 'snapbackDuration', 'theme'],
  outputs: ['ionRefresh', 'ionPull', 'ionStart', 'ionPullStart', 'ionPullEnd'],
})
export class IonRefresher {
  protected el: HTMLIonRefresherElement;
  @Output() ionRefresh = new EventEmitter<IonRefresherCustomEvent<IIonRefresherRefresherEventDetail>>();
  @Output() ionPull = new EventEmitter<IonRefresherCustomEvent<void>>();
  @Output() ionStart = new EventEmitter<IonRefresherCustomEvent<void>>();
  @Output() ionPullStart = new EventEmitter<IonRefresherCustomEvent<void>>();
  @Output() ionPullEnd = new EventEmitter<IonRefresherCustomEvent<IIonRefresherRefresherPullEndEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonRefresherCustomEvent } from '@ionic/core/components';
import type { RefresherEventDetail as IIonRefresherRefresherEventDetail } from '@ionic/core/components';
import type { RefresherPullEndEventDetail as IIonRefresherRefresherPullEndEventDetail } from '@ionic/core/components';

export declare interface IonRefresher extends Components.IonRefresher {
  /**
   * Emitted when the user lets go of the content and has pulled down
further than the `pullMin` or pulls the content down and exceeds the pullMax.
Updates the refresher state to `refreshing`. The `complete()` method should be
called when the async operation has completed.
   */
  ionRefresh: EventEmitter<IonRefresherCustomEvent<IIonRefresherRefresherEventDetail>>;
  /**
   * Emitted while the user is pulling down the content and exposing the refresher.
   */
  ionPull: EventEmitter<IonRefresherCustomEvent<void>>;
  /**
   * Emitted when the user begins to start pulling down. @deprecated Use `ionPullStart` instead.
   */
  ionStart: EventEmitter<IonRefresherCustomEvent<void>>;
  /**
   * Emitted when the user begins to start pulling down.
   */
  ionPullStart: EventEmitter<IonRefresherCustomEvent<void>>;
  /**
   * Emitted when the refresher has returned to the inactive state
after a pull gesture. This fires whether the refresh completed
successfully or was canceled.
   */
  ionPullEnd: EventEmitter<IonRefresherCustomEvent<IIonRefresherRefresherPullEndEventDetail>>;
}


