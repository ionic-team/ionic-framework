import {Directive, ElementRef, Renderer, Optional, Input, Output, ContentChild, EventEmitter} from 'angular2/core';
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
  writeValue(value) {
    this.value = isDefined(value) ? value : '';
    this._buttons.forEach(button => {
      let isChecked = button.checked;
      button.setChecked(isChecked);
      if (isChecked) {
        this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', button.id);
      }
    });
  }

  register(button: RadioButton) {
    this._buttons.push(button);

    button.select.subscribe(() => {
      this.writeValue(button.value);
      this.onChange(button.value);
      this.change.emit(this);
    });
  }

  ngAfterContentInit() {
    this._buttons.forEach(button => {

      if (isDefined(this.value)) {
        let isChecked = (button.value === this.value) || button.checked;
        button.setChecked(isChecked);
        if (isChecked) {
          this.writeValue(button.value);
          //this.onChange(button.value);
          this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', button.id);
        }
      }

    });
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
