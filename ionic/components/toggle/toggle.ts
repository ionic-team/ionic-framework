import {Component, ElementRef, Renderer, Input, Output, EventEmitter, Optional, Provider, forwardRef} from 'angular2/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from 'angular2/common';

import {Form} from '../../util/form';
import {isTrueProperty} from '../../util/util';
import {Item} from '../item/item';
import {pointerCoord} from '../../util/dom';


const TOGGLE_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => Toggle), multi: true});


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
 * @property {boolean} [checked] - whether the toggle it toggled or not
 * @property {boolean} [disabled] - whether the toggle is disabled or not
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
 * @demo /docs/v2/demos/toggle/
 * @see {@link /docs/v2/components#toggle Toggle Component Docs}
 */
@Component({
  selector: 'ion-toggle',
  template:
    '<div class="toggle-icon" [class.toggle-checked]="_checked" [class.toggle-activated]="_activated">' +
      '<div class="toggle-inner"></div>' +
    '</div>' +
    '<button role="checkbox" ' +
            '[id]="id" ' +
            '[attr.aria-checked]="_checked" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            '(touchstart)=pointerDown($event) ' +
            '(touchmove)=pointerMove($event) ' +
            '(mousemove)=pointerMove($event) ' +
            '(mousedown)=pointerDown($event) ' +
            '(touchend)=pointerUp($event) ' +
            '(mouseup)=pointerUp($event) ' +
            '(mouseout)=pointerUp($event) ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.toggle-disabled]': '_disabled'
  },
  providers: [TOGGLE_VALUE_ACCESSOR]
})
export class Toggle implements ControlValueAccessor  {
  private _checked: boolean = false;
  private _disabled: boolean = false;
  private _labelId: string;
  private _activated: boolean = false;
  private _startX: number;
  private _msPrv: number = 0;
  private _fn: Function;

  /**
   * @private
   */
  id: string;

  /**
   * @output {Toggle} expression to evaluate when the toggle value changes
   */
  @Output() change: EventEmitter<Toggle> = new EventEmitter();

  constructor(
    private _form: Form,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    @Optional() private _item: Item
  ) {
    this._form.register(this);

    if (_item) {
      this.id = 'tgl-' + _item.registerInput('toggle');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-toggle', true);
    }
  }

  /**
   * @private
   */
  private pointerDown(ev) {
    if (this._isPrevented(ev)) {
      return;
    }

    this._startX = pointerCoord(ev).x;
    this._activated = true;
  }

  /**
   * @private
   */
  private pointerMove(ev) {
    if (this._startX) {
      if (this._isPrevented(ev)) {
        return;
      }

      let currentX = pointerCoord(ev).x;
      console.debug('toggle, pointerMove', ev.type, currentX);

      if (this._checked) {
        if (currentX + 15 < this._startX) {
          this.onChange(false);
          this._startX = currentX;
          this._activated = true;
        }

      } else if (currentX - 15 > this._startX) {
        this.onChange(true);
        this._startX = currentX;
        this._activated = (currentX < this._startX + 5);
      }
    }
  }

  /**
   * @private
   */
  private pointerUp(ev) {
    if (this._startX) {

      if (this._isPrevented(ev)) {
        return;
      }

      let endX = pointerCoord(ev).x;

      if (this.checked) {
        if (this._startX + 4 > endX) {
          this.onChange(false);
        }

      } else if (this._startX - 4 < endX) {
        this.onChange(true);
      }

      this._activated = false;
      this._startX = null;
    }
  }

  @Input()
  get checked(): boolean {
    return this._checked;
  }

  set checked(val: boolean) {
    this._setChecked(isTrueProperty(val));
    this.onChange(this._checked);
  }

  /**
   * @private
   */
  private _setChecked(isChecked: boolean) {
    if (isChecked !== this._checked) {
      this._checked = isChecked;
      this.change.emit(this);
      this._item && this._item.setCssClass('item-toggle-checked', isChecked);
    }
  }

  /**
   * @private
   */
  writeValue(val: any) {
    this._setChecked( isTrueProperty(val) );
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (isChecked: boolean) => {
      console.debug('toggle, onChange', isChecked);
      fn(isChecked);
      this._setChecked(isChecked);
      this.onTouched();
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-toggle-disabled', this._disabled);
  }

  /**
   * @private
   */
  onChange(isChecked: boolean) {
    // used when this input does not have an ngModel or ngControl
    console.debug('toggle, onChange (no ngModel)', isChecked);
    this._setChecked(isChecked);
    this.onTouched();
  }

  /**
   * @private
   */
  onTouched() {}

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }

  /**
   * @private
   */
  private _isPrevented(ev) {
    if (ev.type.indexOf('touch') > -1) {
      this._msPrv = Date.now() + 2000;

    } else if (this._msPrv > Date.now() && ev.type.indexOf('mouse') > -1) {
      ev.preventDefault();
      ev.stopPropagation();
      return true;
    }
  }

}
