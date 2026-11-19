/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/dist/types/components';

import { defineCustomElement as defineIonReorderGroup } from '@ionic/core/components/ion-reorder-group.js';

@ProxyCmp({
  defineCustomElementFn: defineIonReorderGroup,
  inputs: ['disabled'],
  methods: ['complete']
})
@Component({
  selector: 'ion-reorder-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['disabled'],
  outputs: ['ionItemReorder', 'ionReorderStart', 'ionReorderMove', 'ionReorderEnd'],
})
export class IonReorderGroup {
  protected el: HTMLIonReorderGroupElement;
  @Output() ionItemReorder = new EventEmitter<IonReorderGroupCustomEvent<IIonReorderGroupItemReorderEventDetail>>();
  @Output() ionReorderStart = new EventEmitter<IonReorderGroupCustomEvent<void>>();
  @Output() ionReorderMove = new EventEmitter<IonReorderGroupCustomEvent<IIonReorderGroupReorderMoveEventDetail>>();
  @Output() ionReorderEnd = new EventEmitter<IonReorderGroupCustomEvent<IIonReorderGroupReorderEndEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonReorderGroupCustomEvent } from '@ionic/core/components';
import type { ItemReorderEventDetail as IIonReorderGroupItemReorderEventDetail } from '@ionic/core/components';
import type { ReorderMoveEventDetail as IIonReorderGroupReorderMoveEventDetail } from '@ionic/core/components';
import type { ReorderEndEventDetail as IIonReorderGroupReorderEndEventDetail } from '@ionic/core/components';

export declare interface IonReorderGroup extends Components.IonReorderGroup {
  /**
   * Event that needs to be listened to in order to complete the reorder action. @deprecated Use `ionReorderEnd` instead. If you are accessing
`event.detail.from` or `event.detail.to` and relying on them
being different you should now add checks as they are always emitted
in `ionReorderEnd`, even when they are the same.
   */
  ionItemReorder: EventEmitter<IonReorderGroupCustomEvent<IIonReorderGroupItemReorderEventDetail>>;
  /**
   * Event that is emitted when the reorder gesture starts.
   */
  ionReorderStart: EventEmitter<IonReorderGroupCustomEvent<void>>;
  /**
   * Event that is emitted as the reorder gesture moves.
   */
  ionReorderMove: EventEmitter<IonReorderGroupCustomEvent<IIonReorderGroupReorderMoveEventDetail>>;
  /**
   * Event that is emitted when the reorder gesture ends.
The from and to properties are always available, regardless of
if the reorder gesture moved the item. If the item did not change
from its start position, the from and to properties will be the same.
Once the event has been emitted, the `complete()` method then needs
to be called in order to finalize the reorder action.
   */
  ionReorderEnd: EventEmitter<IonReorderGroupCustomEvent<IIonReorderGroupReorderEndEventDetail>>;
}


