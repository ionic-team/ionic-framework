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
import type { SearchbarInputEventDetail, SearchbarChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-searchbar.js';

/**
 * Value accessor components should not use ProxyCmp
 * and should call defineCustomElement and proxyInputs
 * manually instead. Using both the @ProxyCmp and @Component
 * decorators and useExisting (where useExisting refers to the
 * class) causes ng-packagr to output multiple component variables
 * which breaks treeshaking.
 * For example, the following would be generated:
 * let IonSearchbar = IonSearchbar_1 = class IonSearchbar extends ValueAccessor {
 * Instead, we want only want the class generated:
 * class IonSearchbar extends ValueAccessor {
 */
import { proxyInputs, proxyMethods, proxyOutputs } from './angular-component-lib/utils';

const SEARCHBAR_INPUTS = [
  'animated',
  'autocomplete',
  'autocorrect',
  'cancelButtonIcon',
  'cancelButtonText',
  'clearIcon',
  'color',
  'debounce',
  'disabled',
  'enterkeyhint',
  'inputmode',
  'mode',
  'name',
  'placeholder',
  'searchIcon',
  'showCancelButton',
  'showClearButton',
  'spellcheck',
  'type',
  'value',
];

const SEARCHBAR_METHODS = ['setFocus', 'getInputElement'];

@Component({
  selector: 'ion-searchbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: SEARCHBAR_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonSearchbar,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonSearchbar extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    defineCustomElement();
    proxyInputs(IonSearchbar, SEARCHBAR_INPUTS);
    proxyMethods(IonSearchbar, SEARCHBAR_METHODS);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionInput', 'ionChange', 'ionCancel', 'ionClear', 'ionBlur', 'ionFocus']);
  }

  @HostListener('ionInput', ['$event.target'])
  handleIonInput(el: HTMLIonSearchbarElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonSearchbar extends Components.IonSearchbar {
  /**
   * Emitted when the `value` of the `ion-searchbar` element has changed.
   */
  ionInput: EventEmitter<CustomEvent<SearchbarInputEventDetail>>;
  /**
   * The `ionChange` event is fired for `<ion-searchbar>` elements when the user
modifies the element's value. Unlike the `ionInput` event, the `ionChange`
event is not necessarily fired for each alteration to an element's value.

The `ionChange` event is fired when the value has been committed
by the user. This can happen when the element loses focus or
when the "Enter" key is pressed. `ionChange` can also fire
when clicking the clear or cancel buttons.
   */
  ionChange: EventEmitter<CustomEvent<SearchbarChangeEventDetail>>;
  /**
   * Emitted when the cancel button is clicked.
   */
  ionCancel: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the clear input button is clicked.
   */
  ionClear: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the input loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the input has focus.
   */
  ionFocus: EventEmitter<CustomEvent<void>>;
}
