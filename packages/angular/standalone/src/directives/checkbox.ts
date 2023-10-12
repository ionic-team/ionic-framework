import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  NgZone,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueAccessor, setIonicClasses } from '@ionic/angular/common';
import type { CheckboxChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-checkbox.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const CHECKBOX_INPUTS = [
  'checked',
  'color',
  'disabled',
  'indeterminate',
  'justify',
  'labelPlacement',
  'legacy',
  'mode',
  'name',
  'value',
];

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: CHECKBOX_INPUTS,
})
@Component({
  selector: 'ion-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: CHECKBOX_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonCheckbox,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonCheckbox extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionFocus', 'ionBlur']);
  }

  writeValue(value: boolean): void {
    this.elementRef.nativeElement.checked = this.lastValue = value;
    setIonicClasses(this.elementRef);
  }

  @HostListener('ionChange', ['$event.target'])
  handleIonChange(el: HTMLIonCheckboxElement | HTMLIonToggleElement): void {
    this.handleValueChange(el, el.checked);
  }
}

export declare interface IonCheckbox extends Components.IonCheckbox {
  /**
   * Emitted when the checked property has changed
as a result of a user action such as a click.
This event will not emit when programmatically
setting the checked property.
   */
  ionChange: EventEmitter<CustomEvent<CheckboxChangeEventDetail>>;
  /**
   * Emitted when the checkbox has focus.
   */
  ionFocus: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the checkbox loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<void>>;
}
