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
import type { RadioGroupChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-radio-group.js';

import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

const RADIO_GROUP_INPUTS = ['allowEmptySelection', 'name', 'value'];

/**
 * Pulling the provider into an object and using PURE  works
 * around an ng-packagr issue that causes
 * components with multiple decorators and
 * a provider to be re-assigned. This re-assignment
 * is not supported by Webpack and causes treeshaking
 * to not work on these kinds of components.
 */
const accessorProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: /*@__PURE__*/ forwardRef(() => IonRadioGroup),
  multi: true,
};

@ProxyCmp({
  defineCustomElementFn: defineCustomElement,
  inputs: RADIO_GROUP_INPUTS,
})
@Component({
  selector: 'ion-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: RADIO_GROUP_INPUTS,
  providers: [accessorProvider],
  standalone: true,
})
export class IonRadioGroup extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange']);
  }

  @HostListener('ionChange', ['$event.target'])
  handleIonChange(el: HTMLIonRadioGroupElement): void {
    this.handleValueChange(el, el.value);
  }
}

export declare interface IonRadioGroup extends Components.IonRadioGroup {
  /**
   * Emitted when the value has changed.
   */
  ionChange: EventEmitter<CustomEvent<RadioGroupChangeEventDetail>>;
}
