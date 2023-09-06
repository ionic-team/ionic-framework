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
import type { Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-radio.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const RADIO_INPUTS = ['color', 'disabled', 'justify', 'labelPlacement', 'legacy', 'mode', 'name', 'value'];

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: RADIO_INPUTS,
})
@Component({
  selector: 'ion-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: RADIO_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonRadio,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonRadio extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionFocus', 'ionBlur']);
  }

  @HostListener('ionSelect', ['$event.target'])
  handleIonSelect(el: any): void {
    /**
     * The `el` type is any to access the `checked` state property
     * that is not exposed on the type interface.
     */
    this.handleValueChange(el, el.checked);
  }
}

export declare interface IonRadio extends Components.IonRadio {
  /**
   * Emitted when the radio button has focus.
   */
  ionFocus: EventEmitter<CustomEvent<void>>;
  /**
   * Emitted when the radio button loses focus.
   */
  ionBlur: EventEmitter<CustomEvent<void>>;
}
