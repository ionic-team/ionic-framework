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
import type { SelectChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-select.js';

import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const SELECT_INPUTS = [
  { name: 'cancelIcon', transform: nullableBooleanAttribute },
  'cancelText',
  'color',
  'compareWith',
  { name: 'disabled', transform: nullableBooleanAttribute },
  'errorText',
  'expandedIcon',
  'fill',
  'helperText',
  'interface',
  'interfaceOptions',
  'justify',
  'label',
  'labelPlacement',
  'mode',
  { name: 'multiple', transform: nullableBooleanAttribute },
  'name',
  'okText',
  'placeholder',
  { name: 'required', transform: nullableBooleanAttribute },
  'selectedText',
  'shape',
  'toggleIcon',
  'value',
];

/* ProxyCmp only needs the names, and runs at runtime rather than through the Angular compiler. */
const SELECT_PROXY_INPUTS = SELECT_INPUTS.map((input) => (typeof input === 'string' ? input : input.name));

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: SELECT_PROXY_INPUTS,
  methods: ['open'],
})
@Component({
  selector: 'ion-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: SELECT_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonSelect),
      multi: true,
    },
  ],
  standalone: true,
})
export class IonSelect extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionCancel', 'ionDismiss', 'ionFocus', 'ionBlur']);
  }

  @HostListener('ionChange', ['$event.target'])
  handleIonChange(el: HTMLIonSelectElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonSelect extends Components.IonSelect {
  /**
   * Emitted when the value has changed.
   */
  ionChange: EventEmitter<CustomEvent<SelectChangeEventDetail>>;
  /**
   * Emitted when the selection is cancelled.
   */
  ionCancel: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the overlay is dismissed.
   */
  ionDismiss: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the select has focus.
   */
  ionFocus: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the select loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<void>>;
}
