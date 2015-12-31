import {Component, Directive, ElementRef, Renderer, Optional, Input, Output, HostListener, ContentChildren, ContentChild, EventEmitter} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {ListHeader} from '../list/list';
import {Form} from '../../util/form';
import {isDefined} from '../../util/util';


/**
 * @description
 * A radio button with a unique value. Note that all `<ion-radio>` components
 * must be wrapped within a `<ion-list radio-group>`, and there must be at
 * least two `<ion-radio>` components within the radio group.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/forms/) for more info on forms and input.
 *
 * @usage
 * ```html
 * <ion-radio value="my-value" checked="true">
 *   Radio Label
 * </ion-radio>
 * ```
 * @demo /docs/v2/demos/radio/
 * @see {@link /docs/v2/components#radio Radio Component Docs}
 */
@Component({
  selector: 'ion-radio',
  host: {
    '[attr.id]': 'id',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-labelledby]': 'labelId',
    'class': 'item',
    'role': 'radio',
    'tappable': '',
    'tabindex': '0'
  },
  template:
    '<div class="item-inner">' +
      '<ion-item-content id="{{labelId}}">' +
        '<ng-content></ng-content>' +
      '</ion-item-content>' +
      '<div class="radio-media">' +
        '<div class="radio-icon"></div>' +
      '</div>' +
    '</div>'
})
export class RadioButton {
  @Input() value: string = '';
  @Input() public checked: any = false;
  @Input() disabled: boolean = false;
  @Input() id: string;
  @Output() select: EventEmitter<RadioButton> = new EventEmitter();

  labelId: any;

  constructor(private _form: Form, private _renderer: Renderer, private _elementRef: ElementRef) {
    this._renderer = _renderer;
    this._elementRef = _elementRef;
  }

  /**
   * @private
   */
  ngOnInit() {
    if (!this.id) {
      this.id = 'rb-' + this._form.nextId();
    }
    this.labelId = 'lbl-' + this.id;

    let checked = this.checked;
    if (typeof checked === 'string') {
      this.checked = (checked === '' || checked === 'true');
    }
    this.isChecked = this.checked;
    this._renderer.setElementAttribute(this._elementRef, 'checked', null);
  }

  /**
   * @private
   */
  @HostListener('click', ['$event'])
  private onClick(ev) {
    console.debug('RadioButton, select', this.value);
    this.select.emit(this);
  }

  public set isChecked(isChecked) {
    this._renderer.setElementAttribute(this._elementRef, 'aria-checked', isChecked);
  }
}


/**
 * A radio group is a group of radio components.
 *
 * Selecting a radio button in the group unselects all others in the group.
 *
 * New radios can be registered dynamically.
 *
 * See the [Angular 2 Docs](https://angular.io/docs/js/latest/api/forms/) for more info on forms and input.
 *
 * @usage
 * ```html
 * <ion-list radio-group ngControl="autoManufacturers">
 *
 *   <ion-list-header>
 *     Auto Manufacturers
 *   </ion-list-header>
 *
 *   <ion-radio value="cord">
 *     Cord
 *   </ion-radio>
 *
 *   <ion-radio value="duesenberg" checked="true">
 *     Duesenberg
 *   </ion-radio>
 *
 *   <ion-radio value="hudson">
 *     Hudson
 *   </ion-radio>
 *
 *   <ion-radio value="packard">
 *     Packard
 *   </ion-radio>
 *
 *   <ion-radio value="studebaker">
 *     Studebaker
 *   </ion-radio>
 *
 *   <ion-radio value="tucker">
 *     Tucker
 *   </ion-radio>
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
  @Output() change: EventEmitter<RadioGroup> = new EventEmitter();
  @ContentChildren(RadioButton) private _buttons;
  @ContentChild(ListHeader) private _header;

  id: any;
  value: any;

  constructor(@Optional() private ngControl: NgControl, private _renderer: Renderer, private _elementRef: ElementRef) {
    this.ngControl = ngControl;
    this.id = ++radioGroupIds;

    if (ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * @private
   * Angular2 Forms API method called by the model (Control) on change to update
   * the checked value.
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
   */
  public writeValue(value) {
    this.value = isDefined(value) ? value : '';
    if (this._buttons) {
      let buttons = this._buttons.toArray();
      for (let button of buttons) {
        let isChecked = (button.value === this.value);
        button.isChecked = isChecked;
        if (isChecked) {
          this._renderer.setElementAttribute(this._elementRef, 'aria-activedescendant', button.id);
        }
      }
    }
  }

  public onChange = (_:any) => {};
  public onTouched = () => {};

  /**
   * @private
   * Angular2 Forms API method called by the view (NgControl) to register the
   * onChange event handler that updates the model (Control).
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L27
   * @param {Function} fn  the onChange event handler.
   */
  public registerOnChange(fn) { this.onChange = fn; }

  /**
   * @private
   * Angular2 Forms API method called by the the view (NgControl) to register
   * the onTouched event handler that marks the model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  public registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  ngAfterContentInit() {
    let header = this._header;
    if (header) {
      if (!header.id) {
        header.id = 'rg-hdr-' + this.id;
      }
      this._renderer.setElementAttribute(this._elementRef, 'aria-describedby', header.id);
    }

    let buttons = this._buttons.toArray();
    for (let button of buttons) {
      button.select.subscribe(() => {
        this.writeValue(button.value);
        this.onChange(button.value);
        this.change.emit(this);
      });

      if (isDefined(this.value)) {
        let isChecked = (button.value === this.value) || button.checked;
        button.isChecked = isChecked;
        if (isChecked) {
          this.writeValue(button.value);
          this.onChange(button.value);
          this._renderer.setElementAttribute(this._elementRef, 'aria-activedescendant', button.id);
        }
      }
    }
  }

}

let radioGroupIds = -1;
