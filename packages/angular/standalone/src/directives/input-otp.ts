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
import { ValueAccessor } from '@ionic/angular/common';
import type {
  InputOtpInputEventDetail as IIonInputOtpInputEventDetail,
  InputOtpChangeEventDetail as IIonInputOtpChangeEventDetail,
  InputOtpCompleteEventDetail as IIonInputOtpCompleteEventDetail,
  Components,
} from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-input-otp.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const INPUT_OTP_INPUTS = [
  'autocapitalize',
  'color',
  'disabled',
  'fill',
  'inputmode',
  'length',
  'pattern',
  'readonly',
  'separators',
  'shape',
  'size',
  'type',
  'value',
];

/**
 * Pulling the provider into an object and using PURE works
 * around an ng-packagr issue that causes
 * components with multiple decorators and
 * a provider to be re-assigned. This re-assignment
 * is not supported by Webpack and causes treeshaking
 * to not work on these kinds of components.
 */
const accessorProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: /*@__PURE__*/ forwardRef(() => IonInputOtp),
  multi: true,
};

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: INPUT_OTP_INPUTS,
  methods: ['setFocus'],
})
@Component({
  selector: 'ion-input-otp',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: INPUT_OTP_INPUTS,
  providers: [accessorProvider],
  standalone: true,
})
export class IonInputOtp extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionComplete', 'ionBlur', 'ionFocus']);
  }

  @HostListener('ionInput', ['$event.target'])
  handleIonInput(el: HTMLIonInputOtpElement): void {
    this.handleValueChange(el, el.value);
  }

  registerOnChange(fn: (_: any) => void): void {
    super.registerOnChange((value: string) => {
      if (this.type === 'number') {
        /**
         * If the input type is `number`, we need to convert the value to a number
         * when the value is not empty. If the value is empty, we want to treat
         * the value as null.
         */
        fn(value === '' ? null : parseFloat(value));
      } else {
        fn(value);
      }
    });
  }
}

export declare interface IonInputOtp extends Components.IonInputOtp {
  /**
   * The `ionInput` event is fired each time the user modifies the input's value.
   * Unlike the `ionChange` event, the `ionInput` event is fired for each alteration
   * to the input's value. This typically happens for each keystroke as the user types.
   *
   * For elements that accept text input (`type=text`, `type=tel`, etc.), the interface
   * is [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent); for others,
   * the interface is [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). If
   * the input is cleared on edit, the type is `null`.
   */
  ionInput: EventEmitter<CustomEvent<IIonInputOtpInputEventDetail>>;
  /**
   * The `ionChange` event is fired when the user modifies the input's value.
   * Unlike the `ionInput` event, the `ionChange` event is only fired when changes
   * are committed, not as the user types.
   *
   * The `ionChange` event fires when the `<ion-input-otp>` component loses
   * focus after its value has changed.
   *
   * This event will not emit when programmatically setting the `value` property.
   */
  ionChange: EventEmitter<CustomEvent<IIonInputOtpChangeEventDetail>>;
  /**
   * Emitted when all input boxes have been filled with valid values.
   */
  ionComplete: EventEmitter<CustomEvent<IIonInputOtpCompleteEventDetail>>;
  /**
   * Emitted when the input group loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<FocusEvent>>;
  /**
   * Emitted when the input group has focus.
   */
  ionFocus: EventEmitter<CustomEvent<FocusEvent>>;
}
