/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgZone, EventEmitter, Output } from '@angular/core';

import { ProxyCmp } from './angular-component-lib/utils';

import type { Components } from '@ionic/core/dist/types/components';

import { defineCustomElement as defineIonAccordionGroup } from '@ionic/core/components/ion-accordion-group.js';

@ProxyCmp({
  defineCustomElementFn: defineIonAccordionGroup,
  inputs: ['animated', 'disabled', 'expand', 'mode', 'multiple', 'readonly', 'value']
})
@Component({
  selector: 'ion-accordion-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['animated', 'disabled', 'expand', 'mode', 'multiple', 'readonly', 'value'],
  outputs: ['ionChange'],
})
export class IonAccordionGroup {
  protected el: HTMLIonAccordionGroupElement;
  @Output() ionChange = new EventEmitter<IonAccordionGroupCustomEvent<IIonAccordionGroupAccordionGroupChangeEventDetail>>();
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


import type { IonAccordionGroupCustomEvent } from '@ionic/core/components';
import type { AccordionGroupChangeEventDetail as IIonAccordionGroupAccordionGroupChangeEventDetail } from '@ionic/core/components';

export declare interface IonAccordionGroup extends Components.IonAccordionGroup {
  /**
   * Emitted when the value property has changed as a result of a user action such as a click.

This event will not emit when programmatically setting the `value` property.
   */
  ionChange: EventEmitter<IonAccordionGroupCustomEvent<IIonAccordionGroupAccordionGroupChangeEventDetail>>;
}


