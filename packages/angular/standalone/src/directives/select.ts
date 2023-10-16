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
import type { SelectChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-select.js';

/**
 * Value accessor components should not use ProxyCmp
 * and should call defineCustomElement and proxyInputs
 * manually instead. Using both the @ProxyCmp and @Component
 * decorators and useExisting (where useExisting refers to the
 * class) causes ng-packagr to output multiple component variables
 * which breaks treeshaking.
 * For example, the following would be generated:
 * let IonSelect = IonSelect_1 = class IonSelect extends ValueAccessor {
 * Instead, we want only want the class generated:
 * class IonSelect extends ValueAccessor {
 */
import { proxyInputs, proxyMethods, proxyOutputs } from './angular-component-lib/utils';

const SELECT_INPUTS = [
  'cancelText',
  'color',
  'compareWith',
  'disabled',
  'expandedIcon',
  'fill',
  'interface',
  'interfaceOptions',
  'justify',
  'label',
  'labelPlacement',
  'legacy',
  'mode',
  'multiple',
  'name',
  'okText',
  'placeholder',
  'selectedText',
  'shape',
  'toggleIcon',
  'value',
];

const SELECT_METHODS = ['open'];

@Component({
  selector: 'ion-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: SELECT_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonSelect,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonSelect extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    defineCustomElement();
    proxyInputs(IonSelect, SELECT_INPUTS);
    proxyMethods(IonSelect, SELECT_METHODS);
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
