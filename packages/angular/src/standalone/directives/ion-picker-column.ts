/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/components';

import { defineCustomElement as defineIonPickerColumn } from '@ionic/core/components/ion-picker-column.js';

@ProxyCmp({
  defineCustomElementFn: defineIonPickerColumn,
  inputs: ['color', 'disabled', 'mode', 'value'],
  methods: ['setFocus']
})
@Component({
  selector: 'ion-picker-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['color', 'disabled', 'mode', 'value'],
  outputs: ['ionChange'],
})
export class IonPickerColumn {
  protected el: HTMLIonPickerColumnElement;
  @Output() ionChange = new EventEmitter<IonPickerColumnCustomEvent<IIonPickerColumnPickerColumnChangeEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonPickerColumnCustomEvent } from '@ionic/core/components';
import type { PickerColumnChangeEventDetail as IIonPickerColumnPickerColumnChangeEventDetail } from '@ionic/core/components';

export declare interface IonPickerColumn extends Components.IonPickerColumn {
  /**
   * Emitted when the value has changed.

This event will not emit when programmatically setting the `value` property.
   */
  ionChange: EventEmitter<IonPickerColumnCustomEvent<IIonPickerColumnPickerColumnChangeEventDetail>>;
}


