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
    'role': 'radio',
    'class': 'item',
    'tappable': '',
    'tabindex': '0',
    '[attr.aria-disabled]': 'disabled'
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
  labelId: any;

  @Input() checked: any = false;
  @Input() disabled: boolean = false;
  @Input() id: string;
  @Input() value: string = '';

  @Output() select: EventEmitter<RadioButton> = new EventEmitter();

  constructor(
    private _form: Form,
    private _renderer: Renderer,
    private _elementRef: ElementRef
  ) {
    _form.register(this);
  }

  /**
   * @private
   */
  ngOnInit() {
    if (!this.id) {
      this.id = 'rb-' + this._form.nextId();
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'id', this.id);
    }
    this.labelId = 'lbl-' + this.id;
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-labelledby', this.labelId);

    let checked = this.checked;
    if (typeof checked === 'string') {
      this.checked = (checked === '' || checked === 'true');
    }
    this.isChecked = this.checked;
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'checked', null);
  }

  /**
   * @private
   */
  @HostListener('click')
  private _click() {
    console.debug('RadioButton, select', this.value);
    this.select.emit(this);
  }

  public set isChecked(isChecked) {
    this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-checked', isChecked);
  }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
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
  id;
  value;

  @Output() change: EventEmitter<RadioGroup> = new EventEmitter();
  @ContentChildren(RadioButton) private _buttons;
  @ContentChild(ListHeader) private _header;

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
    if (this._buttons) {
      let buttons = this._buttons.toArray();
      for (let button of buttons) {
        let isChecked = (button.value === this.value);
        button.isChecked = isChecked;
        if (isChecked) {
          this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', button.id);
        }
      }
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

  /**
   * @private
   */
  ngAfterContentInit() {
    let header = this._header;
    if (header) {
      if (!header.id) {
        header.id = 'rg-hdr-' + this.id;
      }
      this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-describedby', header.id);
    }

    this._buttons.toArray().forEach(button => {
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
          //this.onChange(button.value);
          this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', button.id);
        }
      }
    });
  }

}

let radioGroupIds = -1;
