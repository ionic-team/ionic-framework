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
import type { TextareaChangeEventDetail, TextareaInputEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-textarea.js';

import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const TEXTAREA_INPUTS = [
  { name: 'autoGrow', transform: nullableBooleanAttribute },
  'autocapitalize',
  { name: 'autofocus', transform: nullableBooleanAttribute },
  { name: 'clearOnEdit', transform: nullableBooleanAttribute },
  'color',
  'cols',
  { name: 'counter', transform: nullableBooleanAttribute },
  'counterFormatter',
  'debounce',
  { name: 'disabled', transform: nullableBooleanAttribute },
  'enterkeyhint',
  'errorText',
  'fill',
  'helperText',
  'inputmode',
  'label',
  'labelPlacement',
  'maxlength',
  'minlength',
  'mode',
  'name',
  'placeholder',
  { name: 'readonly', transform: nullableBooleanAttribute },
  { name: 'required', transform: nullableBooleanAttribute },
  'rows',
  'shape',
  { name: 'spellcheck', transform: nullableBooleanAttribute },
  'value',
  'wrap',
];

/* ProxyCmp only needs the names, and runs at runtime rather than through the Angular compiler. */
const TEXTAREA_PROXY_INPUTS = TEXTAREA_INPUTS.map((input) => (typeof input === 'string' ? input : input.name));

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: TEXTAREA_PROXY_INPUTS,
  methods: ['setFocus', 'getInputElement'],
})
@Component({
  selector: 'ion-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: TEXTAREA_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonTextarea),
      multi: true,
    },
  ],
  standalone: true,
})
export class IonTextarea extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionInput', 'ionBlur', 'ionFocus']);
  }

  @HostListener('ionInput', ['$event.target'])
  handleIonInput(el: HTMLIonTextareaElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonTextarea extends Components.IonTextarea {
  /**
   * The `ionChange` event is fired when the user modifies the textarea's value.
Unlike the `ionInput` event, the `ionChange` event is fired when
the element loses focus after its value has been modified.
   */
  ionChange: EventEmitter<CustomEvent<TextareaChangeEventDetail>>;
  /**
   * The `ionInput` event is fired each time the user modifies the textarea's value.
Unlike the `ionChange` event, the `ionInput` event is fired for each alteration
to the textarea's value. This typically happens for each keystroke as the user types.

When `clearOnEdit` is enabled, the `ionInput` event will be fired when
the user clears the textarea by performing a keydown event.
   */
  ionInput: EventEmitter<CustomEvent<TextareaInputEventDetail>>;
  /**
   * Emitted when the input loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<FocusEvent>>;
  /**
   * Emitted when the input has focus.
   */
  ionFocus: EventEmitter<CustomEvent<FocusEvent>>;
}
