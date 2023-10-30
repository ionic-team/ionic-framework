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
import type { DatetimeChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-datetime.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

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
  useExisting: /*@__PURE__*/ forwardRef(() => IonDatetime),
  multi: true,
};

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: DATETIME_INPUTS,
  methods: ['confirm', 'reset', 'cancel'],
})
@Component({
  selector: 'ion-datetime',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: DATETIME_INPUTS,
  providers: [accessorProvider],
  standalone: true,
})
export class IonDatetime extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
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
