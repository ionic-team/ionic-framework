import {Component, ElementRef, Renderer, Input, Optional} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Form} from '../../util/form';
import {Config} from '../../config/config';
import {isTrueProperty} from '../../util/util';
import {Item} from '../item/item';
import {pointerCoord} from '../../util/dom';


/**
 * @name Toggle
 * @description
 * A toggle technically is the same thing as an HTML checkbox input,
 * except it looks different and is easier to use on a touch device.
 * Toggles can also have colors assigned to them, by adding any color
 * attribute.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/forms/) for more info on forms and input.
 * @property {any} [value] - the inital value of the toggle
 * @property {boolean} [checked] - whether the toggle it toggled or not
 * @property {boolean} [disabled] - whether the toggle is disabled or not
 * @property {string} [id] - a unique ID for a toggle
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-toggle value="pepperoni" checked="true"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-toggle value="sausage"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-toggle value="mushrooms"></ion-toggle>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 * @demo /docs/v2/demos/toggle/
 * @see {@link /docs/v2/components#toggle Toggle Component Docs}
 */
@Component({
  selector: 'ion-toggle,ion-switch',
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
  }
})
export class Toggle {
  private _checked: any = false;
  private _disabled: any = false;
  private _labelId: string;
  private _activated: boolean = false;
  private _mode: string;
  private _startX;
  private _touched: number = 0;

  id: string;

  @Input() value: string = '';

  constructor(
    private _form: Form,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    config: Config,
    @Optional() ngControl: NgControl,
    @Optional() private _item: Item
  ) {
    // deprecated warning
    if (_elementRef.nativeElement.tagName == 'ION-SWITCH') {
      console.warn('<ion-switch> has been renamed to <ion-toggle>, please update your HTML');
    }

    _form.register(this);

    this._mode = config.get('mode');

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    if (_item) {
      this.id = 'tgl-' + _item.registerInput('toggle');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-toggle', true);
    }
  }

  /**
   * @private
   * Toggle the checked state of this toggle.
   */
  toggle() {
    this.checked = !this.checked;
  }

  @Input()
  get checked() {
    return this._checked;
  }

  set checked(val) {
    if (!this._disabled) {
      this._checked = isTrueProperty(val);
      this.onChange(this._checked);
      this._item && this._item.setCssClass('item-toggle-checked', this._checked);
    }
  }

  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-toggle-disabled', this._disabled);
  }

  /**
   * @private
   */
  private pointerDown(ev) {
    if (ev.type.indexOf('touch') > -1) {
      this._touched = Date.now();
    }

    if (this.isDisabled(ev)) {
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
      let currentX = pointerCoord(ev).x;
      console.debug('toggle move', ev.type, currentX);

      if (this._checked) {
        if (currentX + 15 < this._startX) {
          this.toggle();
          this._startX = currentX;
        }

      } else if (currentX - 15 > this._startX) {
        this.toggle();
        this._startX = currentX;
      }
    }
  }

  /**
   * @private
   */
  private pointerUp(ev) {
    if (this._startX) {

      if (this.isDisabled(ev)) {
        return;
      }

      let endX = pointerCoord(ev).x;

      if (this.checked) {
        if (this._startX + 4 > endX) {
          this.toggle();
        }
      } else if (this._startX - 4 < endX) {
        this.toggle();
      }

      this._activated = false;
      this._startX = null;
    }
  }

  /**
   * @private
   */
  writeValue(value) {
    this.checked = value;
  }

  /**
   * @private
   */
  onChange(val) {
    // TODO: figure the whys and the becauses
  }

  /**
   * @private
   */
  onTouched(val) {
    // TODO: figure the whys and the becauses
  }

  /**
   * @private
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }

  /**
   * @private
   */
  private isDisabled(ev) {
    return (this._touched + 999 > Date.now() && (ev.type.indexOf('mouse') > -1))
           || (this._mode == 'ios' && ev.target.tagName == 'ION-TOGGLE');
  }

}
