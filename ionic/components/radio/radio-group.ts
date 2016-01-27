import {Directive, ElementRef, Renderer, Optional, Input, Output, HostListener, ContentChild, EventEmitter} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {RadioButton} from './radio-button';
import {ListHeader} from '../list/list';
import {isDefined} from '../../util/util';


/**
 * A radio group is a group of radio components, and its value comes
 * from the selected radio button's value. Selecting a radio button
 * in the group unselects all others in the group.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/forms/) for more info on forms and input.
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
 *     <ion-radio value="duesenberg" checked="true"></ion-radio>
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
 * @demo /docs/v2/demos/radio/
 * @see {@link /docs/v2/components#radio Radio Component Docs}
*/
@Directive({
  selector: '[radio-group]',
  host: {
    '[attr.aria-activedescendant]': 'activeId',
    'role': 'radiogroup'
  }
})
export class RadioGroup {
  private _buttons: Array<RadioButton> = [];
  private _ids: number = -1;
  private _init: boolean = false;

  id;
  value;

  @Output() change: EventEmitter<RadioGroup> = new EventEmitter();

  constructor(
    @Optional() ngControl: NgControl,
    private _renderer: Renderer,
    private _elementRef: ElementRef
  ) {
    this.id = ++radioGroupIds;

    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  /**
   * @private
   * Angular2 Forms API method called by the model (Control) on change to update
   * the checked value.
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
   */
  writeValue(val) {
    if (val !== null) {
      let oldVal = this.value;

      // set the radiogroup's value
      this.value = val || '';

      this.updateValue();

      // only emit change when it...changed
      if (this.value !== oldVal && this._init) {
        this.change.emit(this.value);
      }

      this._init = true;
    }
  }

  ngAfterContentInit() {
    // in a setTimeout to prevent
    // Expression '_checked in RadioButton@0:24' has changed after
    // it was checked. Previous value: 'true'. Current value: 'false'
    // should be available in future versions of ng2
    setTimeout(() => {
      this.updateValue();
    });
  }

  private updateValue() {
    if (isDefined(this.value)) {
      // loop through each of the radiobuttons
      this._buttons.forEach(radioButton => {

        // check this radiobutton if its value is
        // the same as the radiogroups value
        let isChecked = (radioButton.value === this.value);

        radioButton.updateAsChecked(isChecked);

        if (isChecked) {
          // if this button is checked, then set it as
          // the radiogroup's active descendant
          this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', radioButton.id);
        }
      });
    }
  }

  register(button: RadioButton): string {
    this._buttons.push(button);

    // listen for radiobutton select events
    button.select.subscribe(() => {
      // this radiobutton has been selected
      this.writeValue(button.value);
      this.onChange(button.value);
    });

    return this.id + '-' + (++this._ids);
  }

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
  onChange(val) {}

  /**
   * @private
   */
  onTouched(val) {}

  /**
   * @private
   * Angular2 Forms API method called by the view (NgControl) to register the
   * onChange event handler that updates the model (Control).
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L27
   * @param {Function} fn  the onChange event handler.
   */
  registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   * Angular2 Forms API method called by the the view (NgControl) to register
   * the onTouched event handler that marks the model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn) { this.onTouched = fn; }

}

let radioGroupIds = -1;
