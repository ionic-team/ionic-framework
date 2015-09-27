import {
  View,
  Directive,
  ElementRef,
  Optional,
  NgControl
} from 'angular2/angular2';

import {Ion} from '../ion';
import {IonInput} from '../form/input';
import {IonicConfig} from '../../config/config';
import {IonicComponent, IonicView} from '../../config/decorators';

/**
 * @name ionCheckbox
 * @description
 * The checkbox is no different than the HTML checkbox input, except it's styled differently
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/forms/) for more info on forms and input.
 *
 * @usage
 * ```html
 * <ion-checkbox checked="true" value="isChecked" ng-control="htmlCtrl">
 *   HTML5
 * </ion-checkbox>
 * ```
 */
@IonicComponent({
  selector: 'ion-checkbox',
  properties: [
    'value',
    'checked',
    'disabled',
    'id'
  ],
  host: {
    'class': 'item',
    'role': 'checkbox',
    'tappable': 'true',
    '[attr.tab-index]': 'tabIndex',
    '[attr.aria-checked]': 'checked',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-labelledby]': 'labelId',
    '(click)': 'click($event)'
  }
})
@IonicView({
  template:
  '<media-checkbox disable-activated>' +
    '<checkbox-icon></checkbox-icon>' +
  '</media-checkbox>' +
  '<ion-item-content id="{{labelId}}">' +
    '<ng-content></ng-content>' +
  '</ion-item-content>'
})
export class Checkbox extends Ion {
  /**
   * TODO
   * @param {ElementRef} elementRef  TODO
   * @param {IonicConfig} ionicConfig  TODO
   * @param {NgControl=} ngControl  TODO
   */
  constructor(
    elementRef: ElementRef,
    config: IonicConfig,
    @Optional() ngControl: NgControl
  ) {
    super(elementRef, config);
    this.tabIndex = 0;
    this.id = IonInput.nextId();

    this.onChange = (_) => {};
    this.onTouched = (_) => {};

    this.ngControl = ngControl;

    if (ngControl) ngControl.valueAccessor = this;
  }

  /**
   * TODO
   */
  onInit() {
    super.onInit();
    this.labelId = 'label-' + this.id;
  }

  /**
   * Toggle the checked state of the checkbox. Calls onChange to pass the
   * updated checked state to the model (Control).
   */
  toggle() {
    this.checked = !this.checked;
    this.onChange(this.checked);
  }

  /**
   * Click event handler to toggle the checkbox checked state.
   * @param {MouseEvent} ev  The click event.
   */
  click(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.toggle();
  }

  /**
   * @private
   * Angular2 Forms API method called by the model (Control) on change to update
   * the checked value.
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
   */
  writeValue(value) {
    this.checked = value;
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
   * the onTouched event handler that marks model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn) { this.onTouched = fn; }
}
