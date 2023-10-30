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
import type { DatetimeChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-datetime.js';

/**
 * Value accessor components should not use ProxyCmp
 * and should call defineCustomElement and proxyInputs
 * manually instead. Using both the @ProxyCmp and @Component
 * decorators and useExisting (where useExisting refers to the
 * class) causes ng-packagr to output multiple component variables
 * which breaks treeshaking.
 * For example, the following would be generated:
 * let IonDatetime = IonDatetime_1 = class IonDatetime extends ValueAccessor {
 * Instead, we want only want the class generated:
 * class IonDatetime extends ValueAccessor {
 */
import { proxyInputs, proxyMethods, proxyOutputs } from './angular-component-lib/utils';

const DATETIME_INPUTS = [
  'cancelText',
  'clearText',
  'color',
  'dayValues',
  'disabled',
  'doneText',
  'firstDayOfWeek',
  'highlightedDates',
  'hourCycle',
  'hourValues',
  'isDateEnabled',
  'locale',
  'max',
  'min',
  'minuteValues',
  'mode',
  'monthValues',
  'multiple',
  'name',
  'preferWheel',
  'presentation',
  'readonly',
  'showClearButton',
  'showDefaultButtons',
  'showDefaultTimeLabel',
  'showDefaultTitle',
  'size',
  'titleSelectedDatesFormatter',
  'value',
  'yearValues',
];

const DATETIME_METHODS = ['confirm', 'reset', 'cancel'];

@Component({
  selector: 'ion-datetime',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: DATETIME_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonDatetime,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonDatetime extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    defineCustomElement();
    c.detach();
    this.el = r.nativeElement;
    /**
     * Data-bound input properties are set
     * by Angular after the constructor, so
     * we need to run the proxy before ngOnInit.
     */
    proxyInputs(IonDatetime, DATETIME_INPUTS);
    proxyMethods(IonDatetime, DATETIME_METHODS);
    proxyOutputs(this, this.el, ['ionCancel', 'ionChange', 'ionFocus', 'ionBlur']);
  }

  @HostListener('ionChange', ['$event.target'])
  handleIonChange(el: HTMLIonDatetimeElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonDatetime extends Components.IonDatetime {
  /**
   * Emitted when the datetime selection was cancelled.
   */
  ionCancel: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the value (selected date) has changed.
   */
  ionChange: EventEmitter<CustomEvent<DatetimeChangeEventDetail>>;
  /**
   * Emitted when the datetime has focus.
   */
  ionFocus: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the datetime loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<void>>;
}
