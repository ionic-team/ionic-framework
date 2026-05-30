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
  RangeChangeEventDetail,
  RangeKnobMoveStartEventDetail,
  RangeKnobMoveEndEventDetail,
  Components,
} from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-range.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const RANGE_INPUTS = [
  'activeBarStart',
  'color',
  'debounce',
  'disabled',
  'dualKnobs',
  'label',
  'labelPlacement',
  'max',
  'min',
  'mode',
  'name',
  'pin',
  'pinFormatter',
  'snaps',
  'step',
  'ticks',
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
  useExisting: /*@__PURE__*/ forwardRef(() => IonRange),
  multi: true,
};

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: RANGE_INPUTS,
})
@Component({
  selector: 'ion-range',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: RANGE_INPUTS,
  providers: [accessorProvider],
  standalone: true,
})
export class IonRange extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionInput', 'ionFocus', 'ionBlur', 'ionKnobMoveStart', 'ionKnobMoveEnd']);
  }

  @HostListener('ionInput', ['$event.target'])
  handleIonInput(el: HTMLIonRangeElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonRange extends Components.IonRange {
  /**
   * The `ionChange` event is fired for `<ion-range>` elements when the user
modifies the element's value:
- When the user releases the knob after dragging;
- When the user moves the knob with keyboard arrows

`ionChange` is not fired when the value is changed programmatically.
   */
  ionChange: EventEmitter<CustomEvent<RangeChangeEventDetail>>;
  /**
   * The `ionInput` event is fired for `<ion-range>` elements when the value
is modified. Unlike `ionChange`, `ionInput` is fired continuously
while the user is dragging the knob.
   */
  ionInput: EventEmitter<CustomEvent<RangeChangeEventDetail>>;
  /**
   * Emitted when the range has focus.
   */
  ionFocus: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the range loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the user starts moving the range knob, whether through
mouse drag, touch gesture, or keyboard interaction.
   */
  ionKnobMoveStart: EventEmitter<CustomEvent<RangeKnobMoveStartEventDetail>>;
  /**
   * Emitted when the user finishes moving the range knob, whether through
mouse drag, touch gesture, or keyboard interaction.
   */
  ionKnobMoveEnd: EventEmitter<CustomEvent<RangeKnobMoveEndEventDetail>>;
}
