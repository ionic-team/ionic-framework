import { ChangeDetectorRef, ContentChild, Directive, ElementRef, EventEmitter, Input, Output, Renderer } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ListHeader } from '../list/list-header';
import { isCheckedProperty, isTrueProperty } from '../../util/util';
import { RadioButton } from './radio-button';

/**
 * @name RadioGroup
 * @description
 * A radio group is a group of [radio buttons](../RadioButton). It allows
 * a user to select at most one radio button from a set. Checking one radio
 * button that belongs to a radio group unchecks any previous checked
 * radio button within the same group.
 *
 * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more information on forms and inputs.
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
 * @demo /docs/demos/src/radio/
 * @see {@link /docs/components#radio Radio Component Docs}
 * @see {@link ../RadioButton RadioButton API Docs}
*/
@Directive({
  selector: '[radio-group]',
  host: {
    'role': 'radiogroup'
  },
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: RadioGroup, multi: true } ],
})
export class RadioGroup {

  /**
   * @internal
   */
  _disabled: boolean = false;

  /**
   * @hidden
   */
  _btns: RadioButton[] = [];

  /**
   * @hidden
   */
  _fn: Function;

  /**
   * @hidden
   */
  _ids: number = -1;

  /**
   * @hidden
   */
  _init: boolean = false;

  /**
   * @hidden
   */
  value: any;

  /**
   * @hidden
   */
  id: number;

  /**
   * @input {boolean} If true, the user cannot interact with any of the buttons in the group.
   */
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = isTrueProperty(val);
  }

  /**
   * @output {any} Emitted when the selected button has changed.
   */
  @Output() ionChange: EventEmitter<RadioGroup> = new EventEmitter<RadioGroup>();

  constructor(
    private _renderer: Renderer,
    private _elementRef: ElementRef,
    private _cd: ChangeDetectorRef
  ) {
    this.id = ++radioGroupIds;
  }

  /**
   * @hidden
   */
  ngAfterContentInit() {
    let activeButton = this._btns.find(b => b.checked);
    if (activeButton) {
      this._setActive(activeButton);
    }
  }

  /**
   * @hidden
   */
  writeValue(val: any) {
    console.debug('radio group, writeValue', val);
    this.value = val;

    if (this._init) {
      this._update();
      this.onTouched();
      this.ionChange.emit(val);
    }

    this._init = true;
  }

  /**
   * @hidden
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (val: any) => {
      // onChange used when there's an formControlName
      console.debug('radio group, onChange', val);
      fn(val);
      this.value = val;
      this._update();
      this.onTouched();
      this.ionChange.emit(val);
    };
  }

  /**
   * @hidden
   */
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * @hidden
   */
  _update() {
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

  /**
   * @hidden
   */
  _setActive(radioButton: RadioButton) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', radioButton.id);
  }

  /**
   * @hidden
   */
  add(button: RadioButton): string {
    this._btns.push(button);

    // listen for radiobutton select events
    button.ionSelect.subscribe((val: any) => {
      // this radiobutton has been selected
      this.onChange(val);
    });

    return this.id + '-' + (++this._ids);
  }

  /**
   * @hidden
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
   * @hidden
   */
  @ContentChild(ListHeader)
  set _header(header: any) {
    if (header) {
      if (!header.id) {
        header.id = 'rg-hdr-' + this.id;
      }
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-describedby', header.id);
    }
  }

  /**
   * @hidden
   */
  onChange(val: any) {
    // onChange used when there is not an formControlName
    console.debug('radio group, onChange w/out formControlName', val);
    this.value = val;
    this._update();
    this.onTouched();
    this.ionChange.emit(val);
    this._cd.detectChanges();
  }

  /**
   * @hidden
   */
  onTouched() {}

  /**
   * @hidden
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

}

let radioGroupIds = -1;
