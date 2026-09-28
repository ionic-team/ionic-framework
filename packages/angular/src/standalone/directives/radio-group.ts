import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  NgZone,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { inputNames, ValueAccessor } from '@ionic/angular/common';
import type { RadioGroupChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-radio-group.js';

import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const RADIO_GROUP_INPUTS = [
  { name: 'allowEmptySelection', transform: nullableBooleanAttribute },
  'compareWith',
  'errorText',
  'helperText',
  'name',
  'value',
];

const RADIO_GROUP_PROXY_INPUTS = inputNames(RADIO_GROUP_INPUTS);

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: RADIO_GROUP_PROXY_INPUTS,
})
@Component({
  selector: 'ion-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: RADIO_GROUP_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonRadioGroup),
      multi: true,
    },
  ],
  standalone: true,
})
export class IonRadioGroup extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange']);
  }

  @HostListener('ionChange', ['$event.target'])
  handleIonChange(el: HTMLIonRadioGroupElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonRadioGroup extends Components.IonRadioGroup {
  /**
   * Emitted when the value has changed.
   */
  ionChange: EventEmitter<CustomEvent<RadioGroupChangeEventDetail>>;
}
