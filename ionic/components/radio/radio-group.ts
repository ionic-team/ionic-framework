import {Directive, ElementRef, Renderer, Optional, Input, Output, Provider, forwardRef, HostListener, ContentChild, EventEmitter} from 'angular2/core';
import {NG_VALUE_ACCESSOR} from 'angular2/common';

import {RadioButton} from './radio-button';
import {ListHeader} from '../list/list';
import {isPresent, isCheckedProperty} from '../../util/util';

const RADIO_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => RadioGroup), multi: true});

/**
 * @name RadioGroup
 * @description
 * A radio group is a group of radio button components, and its value
 * comes from the checked radio button's value. Selecting a radio
 * button in the group unchecks all others in the group.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 * @usage
 * ```html
 * <ion-list radio-group [(ngModel)]="autoManufacturers">
 *
 *   <ion-list-header>
 *     Auto Manufacturers
 *   </ion-list-header>
 *
 *   <ion-item>
 *     <ion-label>Cord</ion-label>
 *     <ion-radio value="cord"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Duesenberg</ion-label>
 *     <ion-radio value="duesenberg"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Hudson</ion-label>
 *     <ion-radio value="hudson"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Packard</ion-label>
 *     <ion-radio value="packard"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Studebaker</ion-label>
 *     <ion-radio value="studebaker"></ion-radio>
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * @demo /docs/v2/demos/radio/
 * @see {@link /docs/v2/components#radio Radio Component Docs}
*/
@Directive({
  selector: '[radio-group]',
  host: {
    '[attr.aria-activedescendant]': 'activeId',
    'role': 'radiogroup'
  },
  providers: [RADIO_VALUE_ACCESSOR]
})
export class RadioGroup {
  private _btns: Array<RadioButton> = [];
  private _fn: Function;
  private _ids: number = -1;
  private _init: boolean = false;

  /**
   * @private
   */
  value: any;

  /**
   * @private
   */
  id: number;

  /**
   * @output {any} expression to be evaluated when selection has been changed
   */
  @Output() change: EventEmitter<RadioGroup> = new EventEmitter();

  constructor(
    private _renderer: Renderer,
    private _elementRef: ElementRef
  ) {
    this.id = ++radioGroupIds;
  }

  /**
   * @private
   */
  writeValue(val: any) {
    console.debug('radio group, writeValue', val);
    this.value = val;

    if (this._init) {
      this._update();
      this.onTouched();
      this.change.emit(val);
    }

    this._init = true;
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    let activeButton = this._btns.find(b => b.checked);
    if (activeButton) {
      this._setActive(activeButton);
    }
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (val: any) => {
      // onChange used when there's an ngControl
      console.debug('radio group, onChange', val);
      fn(val);
      this.value = val;
      this._update();
      this.onTouched();
      this.change.emit(val);
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  private _update() {
    // loop through each of the radiobuttons
    let hasChecked = false;
    this._btns.forEach(radioButton => {

      // check this radiobutton if its value is
      // the same as the radiogroups value
      radioButton.checked = isCheckedProperty(this.value, radioButton.value) && !hasChecked;

      if (radioButton.checked) {
        // if this button is checked, then set it as
        // the radiogroup's active descendant
        this._setActive(radioButton);
        hasChecked = true;
      }
    });
  }

  private _setActive(radioButton: RadioButton) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', radioButton.id);
  }

  /**
   * @private
   */
  add(button: RadioButton): string {
    this._btns.push(button);

    // listen for radiobutton select events
    button.select.subscribe((val) => {
      // this radiobutton has been selected
      this.onChange(val);
    });

    return this.id + '-' + (++this._ids);
  }

  /**
   * @private
   */
  remove(button: RadioButton) {
    let index = this._btns.indexOf(button);
    if (index > -1) {
      if (button.value === this.value) {
        this.value = null;
      }
      this._btns.splice(index, 1);
    }
  }

  /**
   * @private
   */
  @ContentChild(ListHeader)
  private set _header(header) {
    if (header) {
      if (!header.id) {
        header.id = 'rg-hdr-' + this.id;
      }
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-describedby', header.id);
    }
  }

  /**
   * @private
   */
  onChange(val: any) {
    // onChange used when there is not an ngControl
    console.debug('radio group, onChange w/out ngControl', val);
    this.value = val;
    this._update();
    this.onTouched();
    this.change.emit(val);
  }

  /**
   * @private
   */
  onTouched() {}

}

let radioGroupIds = -1;
