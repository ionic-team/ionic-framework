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
  InputInputEventDetail as IIonInputInputInputEventDetail,
  InputChangeEventDetail as IIonInputInputChangeEventDetail,
  Components,
} from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-input.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const INPUT_INPUTS = [
  'accept',
  'autocapitalize',
  'autocomplete',
  'autocorrect',
  'autofocus',
  'clearInput',
  'clearOnEdit',
  'color',
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
  'max',
  'maxlength',
  'min',
  'minlength',
  'mode',
  'multiple',
  'name',
  'pattern',
  'placeholder',
  'readonly',
  'required',
  'shape',
  'size',
  'spellcheck',
  'step',
  'type',
  'value',
];

/**
 * Pulling the provider into an object works
 * around an ng-packagr issue that causes
 * components with multiple decorators and
 * a provider to be re-assigned. This re-assignment
 * is not supported by Webpack and causes treeshaking
 * to not work on these kinds of components.
 */
const accessorProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => IonInput),
  multi: true,
};

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: INPUT_INPUTS,
  methods: ['setFocus', 'getInputElement'],
})
@Component({
  selector: 'ion-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: INPUT_INPUTS,
  providers: [accessorProvider],
  standalone: true,
})
export class IonInput extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionBlur', 'ionFocus']);
  }

  @HostListener('ionInput', ['$event.target'])
  handleIonInput(el: HTMLIonInputElement): void {
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

export declare interface IonInput extends Components.IonInput {
  /**
   * The `ionInput` event is fired each time the user modifies the input's value.
Unlike the `ionChange` event, the `ionInput` event is fired for each alteration
to the input's value. This typically happens for each keystroke as the user types.

For elements that accept text input (`type=text`, `type=tel`, etc.), the interface
is [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent); for others,
the interface is [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). If
the input is cleared on edit, the type is `null`.
   */
  ionInput: EventEmitter<CustomEvent<IIonInputInputInputEventDetail>>;
  /**
   * The `ionChange` event is fired when the user modifies the input's value.
Unlike the `ionInput` event, the `ionChange` event is only fired when changes
are committed, not as the user types.

Depending on the way the users interacts with the element, the `ionChange`
event fires at a different moment:
- When the user commits the change explicitly (e.g. by selecting a date
from a date picker for `<ion-input type="date">`, pressing the "Enter" key, etc.).
- When the element loses focus after its value has changed: for elements
where the user's interaction is typing.
   */
  ionChange: EventEmitter<CustomEvent<IIonInputInputChangeEventDetail>>;
  /**
   * Emitted when the input loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<FocusEvent>>;
  /**
   * Emitted when the input has focus.
   */
  ionFocus: EventEmitter<CustomEvent<FocusEvent>>;
}
