import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Form, IonicTapInput } from '../../util/form';
import { GestureController } from '../../gestures/gesture-controller';
import { Haptic } from '../../tap-click/haptic';
import { Ion } from '../ion';
import { isTrueProperty, assert } from '../../util/util';
import { Item } from '../item/item';
import { KEY_ENTER, KEY_SPACE } from '../../platform/key';
import { Platform } from '../../platform/platform';
import { ToggleGesture } from './toggle-gesture';


export const TOGGLE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Toggle),
  multi: true
};

/**
 * @name Toggle
 * @description
 * A toggle technically is the same thing as an HTML checkbox input,
 * except it looks different and is easier to use on a touch device.
 * Toggles can also have colors assigned to them, by adding any color
 * attribute.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-toggle [(ngModel)]="pepperoni"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-toggle [(ngModel)]="sausage" disabled="true"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-toggle [(ngModel)]="mushrooms"></ion-toggle>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * @demo /docs/demos/src/toggle/
 * @see {@link /docs/components#toggle Toggle Component Docs}
 */
@Component({
  selector: 'ion-toggle',
  template:
    '<div class="toggle-icon" [class.toggle-checked]="_checked" [class.toggle-activated]="_activated">' +
      '<div class="toggle-inner"></div>' +
    '</div>' +
    '<button role="checkbox" ' +
            'type="button" ' +
            'ion-button="item-cover" ' +
            '[id]="id" ' +
            '[attr.aria-checked]="_checked" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.toggle-disabled]': '_disabled'
  },
  providers: [TOGGLE_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
})
export class Toggle extends Ion implements IonicTapInput, AfterContentInit, ControlValueAccessor, OnDestroy  {

  _checked: boolean = false;
  _init: boolean = false;
  _disabled: boolean = false;
  _labelId: string;
  _activated: boolean = false;
  _startX: number;
  _msPrv: number = 0;
  _fn: Function = null;
  _gesture: ToggleGesture;

  /** @hidden */
  id: string;

  /**
   * @output {Toggle} Emitted when the toggle value changes.
   */
  @Output() ionChange: EventEmitter<Toggle> = new EventEmitter<Toggle>();

  constructor(
    public _form: Form,
    config: Config,
    private _plt: Platform,
    elementRef: ElementRef,
    renderer: Renderer,
    private _haptic: Haptic,
    @Optional() public _item: Item,
    private _gestureCtrl: GestureController,
    private _domCtrl: DomController,
    private _cd: ChangeDetectorRef
  ) {
    super(config, elementRef, renderer, 'toggle');
    _form.register(this);

    if (_item) {
      this.id = 'tgl-' + _item.registerInput('toggle');
      this._labelId = 'lbl-' + _item.id;
      this._item.setElementClass('item-toggle', true);
    }
  }

  /**
   * @hidden
   */
  ngAfterContentInit() {
    this._init = true;
    this._gesture = new ToggleGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
    this._gesture.listen();
  }

  /**
   * @hidden
   */
  _onDragStart(startX: number) {
    assert(startX, 'startX must be valid');
    console.debug('toggle, _onDragStart', startX);

    this._startX = startX;
    this._activated = true;
  }

  /**
   * @hidden
   */
  _onDragMove(currentX: number) {
    if (!this._startX) {
      assert(false, '_startX must be valid');
      return;
    }

    console.debug('toggle, _onDragMove', currentX);

    if (this._checked) {
      if (currentX + 15 < this._startX) {
        this.onChange(false);
        this._haptic.selection();
        this._startX = currentX;
        this._activated = true;
      }

    } else if (currentX - 15 > this._startX) {
      this.onChange(true);
      this._haptic.selection();
      this._startX = currentX;
      this._activated = (currentX < this._startX + 5);
    }
  }

  /**
   * @hidden
   */
  _onDragEnd(endX: number) {
    if (!this._startX) {
      assert(false, '_startX must be valid');
      return;
    }
    console.debug('toggle, _onDragEnd', endX);

    if (this.checked) {
      if (this._startX + 4 > endX) {
        this.onChange(false);
        this._haptic.selection();
      }

    } else if (this._startX - 4 < endX) {
      this.onChange(true);
      this._haptic.selection();
    }

    this._activated = false;
    this._startX = null;
  }

  /**
   * @input {boolean} If true, the element is selected.
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(val: boolean) {
    this._setChecked(isTrueProperty(val));
    this.onChange(this._checked);
  }

  /**
   * @hidden
   */
  _setChecked(isChecked: boolean) {
    if (isChecked !== this._checked) {
      this._checked = isChecked;
      if (this._init) {
        this.ionChange.emit(this);
      }
      this._item && this._item.setElementClass('item-toggle-checked', isChecked);
    }
  }

  /**
   * @hidden
   */
  writeValue(val: any) {
    this._setChecked( isTrueProperty(val) );
  }

  /**
   * @hidden
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
  }

  /**
   * @hidden
   */
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  /**
   * @input {boolean} If true, the user cannot interact with this element.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setElementClass('item-toggle-disabled', this._disabled);
  }

  /**
   * @hidden
   */
  onChange(isChecked: boolean) {
    // used when this input does not have an ngModel or formControlName
    console.debug('toggle, onChange', isChecked);
    this._fn && this._fn(isChecked);
    this._setChecked(isChecked);
    this.onTouched();
    this._cd.detectChanges();
  }

  /**
   * @hidden
   */
  onTouched() {}

  /**
   * @hidden
   */
  @HostListener('keyup', ['$event']) _keyup(ev: KeyboardEvent) {
    if (ev.keyCode === KEY_SPACE || ev.keyCode === KEY_ENTER) {
      console.debug(`toggle, keyup: ${ev.keyCode}`);
      ev.preventDefault();
      ev.stopPropagation();
      this.onChange(!this._checked);
    }
  }

  /**
   * @hidden
   */
  initFocus() {
    this._elementRef.nativeElement.querySelector('button').focus();
  }

  /**
   * @hidden
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /**
   * @hidden
   */
  ngOnDestroy() {
    this._form && this._form.deregister(this);
    this._gesture && this._gesture.destroy();
    this._fn = null;
  }

}
