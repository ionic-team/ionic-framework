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
import { ValueAccessor } from '@ionic/angular/common';
import type { TextareaChangeEventDetail, TextareaInputEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-textarea.js';

/**
 * Value accessor components should not use ProxyCmp
 * and should call defineCustomElement and proxyInputs
 * manually instead. Using both the @ProxyCmp and @Component
 * decorators and useExisting (where useExisting refers to the
 * class) causes ng-packagr to output multiple component variables
 * which breaks treeshaking.
 * For example, the following would be generated:
 * let IonTextarea = IonTextarea_1 = class IonTextarea extends ValueAccessor {
 * Instead, we want only want the class generated:
 * class IonTextarea extends ValueAccessor {
 */
import { proxyInputs, proxyMethods, proxyOutputs } from './angular-component-lib/utils';

const TEXTAREA_INPUTS = [
  'autoGrow',
  'autocapitalize',
  'autofocus',
  'clearOnEdit',
  'color',
  'cols',
  'counter',
  'counterFormatter',
  'debounce',
  'disabled',
  'enterkeyhint',
  'errorText',
  'fill',
  'helperText',
  'inputmode',
  'label',
  'labelPlacement',
  'legacy',
  'maxlength',
  'minlength',
  'mode',
  'name',
  'placeholder',
  'readonly',
  'required',
  'rows',
  'shape',
  'spellcheck',
  'value',
  'wrap',
];

const TEXTAREA_METHODS = ['setFocus', 'getInputElement'];

@Component({
  selector: 'ion-textarea',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: TEXTAREA_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonTextarea,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonTextarea extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    defineCustomElement();
    proxyInputs(IonTextarea, TEXTAREA_INPUTS);
    proxyMethods(IonTextarea, TEXTAREA_METHODS);
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
