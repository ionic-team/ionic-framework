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
import type { ToggleChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-toggle.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const TOGGLE_INPUTS = [
  'checked',
  'color',
  'disabled',
  'enableOnOffLabels',
  'justify',
  'labelPlacement',
  'legacy',
  'mode',
  'name',
  'value',
];

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: TOGGLE_INPUTS,
})
@Component({
  selector: 'ion-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: TOGGLE_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonToggle,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonToggle extends ValueAccessor {
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
  handleIonChange(el: HTMLIonToggleElement): void {
    this.handleValueChange(el, el.checked);
  }
}

export declare interface IonToggle extends Components.IonToggle {
  /**
   * Emitted when the user switches the toggle on or off. Does not emit
when programmatically changing the value of the `checked` property.
   */
  ionChange: EventEmitter<CustomEvent<ToggleChangeEventDetail>>;
  /**
   * Emitted when the toggle has focus.
   */
  ionFocus: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the toggle loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<void>>;
}
