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
import { inputNames, ValueAccessor } from '@ionic/angular/common';
import type { SegmentChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-segment.js';

import { nullableBooleanAttribute } from './angular-component-lib/boolean-attribute';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const SEGMENT_INPUTS = [
  'color',
  { name: 'disabled', transform: nullableBooleanAttribute },
  'mode',
  { name: 'scrollable', transform: nullableBooleanAttribute },
  { name: 'selectOnFocus', transform: nullableBooleanAttribute },
  { name: 'swipeGesture', transform: nullableBooleanAttribute },
  'value',
];

const SEGMENT_PROXY_INPUTS = inputNames(SEGMENT_INPUTS);

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: SEGMENT_PROXY_INPUTS,
})
@Component({
  selector: 'ion-segment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: SEGMENT_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonSegment),
      multi: true,
    },
  ],
  standalone: true,
})
export class IonSegment extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange']);
  }

  @HostListener('ionChange', ['$event.target'])
  handleIonChange(el: HTMLIonSegmentElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonSegment extends Components.IonSegment {
  /**
   * Emitted when the value property has changed and any
dragging pointer has been released from `ion-segment`.
   */
  ionChange: EventEmitter<CustomEvent<SegmentChangeEventDetail>>;
}
