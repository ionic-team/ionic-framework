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
import type { RadioGroupChangeEventDetail, Components } from '@ionic/core/components';
import { defineCustomElement } from '@ionic/core/components/ion-radio-group.js';

/**
 * Value accessor components should not use ProxyCmp
 * and should call defineCustomElement and proxyInputs
 * manually instead. Using both the @ProxyCmp and @Component
 * decorators and useExisting (where useExisting refers to the
 * class) causes ng-packagr to output multiple component variables
 * which breaks treeshaking.
 * For example, the following would be generated:
 * let IonRadioGroup = IonRadioGroup_1 = class IonRadioGroup extends ValueAccessor {
 * Instead, we want only want the class generated:
 * class IonRadioGroup extends ValueAccessor {
 */
import { proxyInputs, proxyOutputs } from './angular-component-lib/utils';

const RADIO_GROUP_INPUTS = ['allowEmptySelection', 'name', 'value'];

@Component({
  selector: 'ion-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: RADIO_GROUP_INPUTS,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: IonRadioGroup,
      multi: true,
    },
  ],
  standalone: true,
})
export class IonRadioGroup extends ValueAccessor {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone, injector: Injector) {
    super(injector, r);
    defineCustomElement();
    proxyInputs(IonRadioGroup, RADIO_GROUP_INPUTS);
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
