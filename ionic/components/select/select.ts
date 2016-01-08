import {Component, Directive, Optional, ElementRef, Input, Renderer, HostListener, ContentChild, ContentChildren} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Alert} from '../alert/alert';
import {Form} from '../../util/form';
import {Label} from '../label/label';
import {NavController} from '../nav/nav-controller';
import {Option} from '../option/option';
import {Form} from '../../util/form';
import {merge} from '../../util/util';

/**
 * @usage
 * ```html
 * <ion-select [(ngModel)]="gender">
 *   <ion-label>Gender</ion-label>
 *   <ion-option value="f">Female</ion-option>
 *   <ion-option value="m">Male</ion-option>
 * </ion-select>
 * ```
 */
@Component({
  selector: 'ion-select',
  host: {
    'class': 'item',
    'tappable': '',
    'tabindex': 0,
    '[attr.aria-disabled]': 'disabled'
  },
  template:
    '<ng-content select="[item-left]"></ng-content>' +
    '<div class="item-inner">' +
      '<ion-item-content id="{{labelId}}">' +
        '<ng-content select="ion-label"></ng-content>' +
      '</ion-item-content>' +
      '<div class="select-text-value" item-right>{{selectedText}}</div>' +
      '<div class="select-icon" item-right></div>' +
    '</div>'
})
export class Select {
  @Input() public value: string = '';
  @Input() public alertOptions: any = {};
  @Input() public checked: any = false;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  @Input() multiple: string = '';
  @ContentChild(Label) label: Label;
  @ContentChildren(Option) options;

  constructor(
    private _form: Form,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    @Optional() private _navCtrl: NavController,
    @Optional() ngControl: NgControl
  ) {
    _form.register(this);
    this.selectedText = '';

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    if (!_navCtrl) {
      console.error('parent <ion-nav> required for <ion-select>');
    }
  }

  /**
   * @private
   */
  ngOnInit() {
    if (!this.id) {
      this.id = 'sel-' + this._form.nextId();
      this._renderer.setElementAttribute(this._elementRef, 'id', this.id);
    }

    this.labelId = 'lbl-' + this.id;
    this._renderer.setElementAttribute(this._elementRef, 'aria-labelledby', this.labelId);
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    let selectedOption = this.options.toArray().find(o => o.checked);
    if (selectedOption) {
      this.value = selectedOption.value;
      this.selectedText = selectedOption.text;
      setTimeout(()=> {
        this.onChange(this.value);
      });
    }
  }

  /**
   * @private
   */
  @HostListener('click')
  _click() {
    let cancelText = 'Cancel';
    let submitText = 'OK';

    let isMulti = (this.multiple === true || this.multiple === 'true');

    // the user may have assigned some options specifically for the alert
    let alertOptions = merge({}, this.alertOptions);

    // user can provide buttons, but only two of them, and only as text
    // index 0 becomes the cancel text, index 1 becomes the submit (ok) text
    if (alertOptions.buttons && alertOptions.buttons.length === 2) {
      cancelText = alertOptions.buttons[0];
      submitText = alertOptions.buttons[1];
    }

    // make sure their buttons array is removed from the options
    // and we create a new array for the alert's two buttons
    alertOptions.buttons = [cancelText];

    // if the alertOptions didn't provide an title then use the label's text
    if (!alertOptions.title) {
      alertOptions.title = this.label.text;
    }

    // user cannot provide inputs from alertOptions
    // alert inputs must be created by ionic from ion-options
    alertOptions.inputs = this.options.toArray().map(input => {
      return {
        type: (isMulti ? 'checkbox' : 'radio'),
        label: input.text,
        value: input.value,
        checked: !!input.checked
      }
    });

    // create the alert instance from our built up alertOptions
    let alert = Alert.create(alertOptions);

    if (isMulti) {
      // use checkboxes
      alert.setCssClass('select-alert multiple-select-alert');

      alert.addButton({
        text: submitText,
        handler: selectedValues => {
          // passed an array of all the values which were checked
          this.value = selectedValues;

          // keep a list of all the selected texts
          let selectedTexts = [];

          this.options.toArray().forEach(option => {
            if (selectedValues.indexOf(option.value) > -1) {
              // this option is one that was checked
              option.checked = true;
              selectedTexts.push(option.text);

            } else {
              // this option was not checked
              option.checked = false;
            }
          });

          this.selectedText = selectedTexts.join(', ');

          this.onChange(selectedValues);
        }
      });

    } else {
      // use radio buttons
      alert.setCssClass('select-alert single-select-alert');

      alert.addButton({
        text: submitText,
        handler: selectedValue => {
          // passed the single value that was checked
          // or undefined if nothing was checked
          this.value = selectedValue;

          this.selectedText = '';
          this.options.toArray().forEach(option => {
            if (option.value === selectedValue) {
              // this option was the one that was checked
              option.checked = true;
              this.selectedText = option.text;

            } else {
              // this option was not checked
              option.checked = false;
            }
          });

          this.onChange(selectedValue);
        }
      });
    }

    this._navCtrl.present(alert);
  }

  /**
   * @private
   * Angular2 Forms API method called by the model (Control) on change to update
   * the checked value.
   * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
   */
  writeValue(value) {
    this.value = value;
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
   * the onTouched event handler that marks model (Control) as touched.
   * @param {Function} fn  onTouched event handler.
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
