import {Component, Optional, ElementRef, Renderer, Input, Output, Provider, forwardRef, EventEmitter, HostListener, ContentChildren, QueryList, ViewEncapsulation} from 'angular2/core';
import {NG_VALUE_ACCESSOR} from 'angular2/common';

import {Alert} from '../alert/alert';
import {ActionSheet} from '../action-sheet/action-sheet';
import {Form} from '../../util/form';
import {Item} from '../item/item';
import {merge, isTrueProperty, isBlank, isCheckedProperty} from '../../util/util';
import {NavController} from '../nav/nav-controller';
import {Option} from '../option/option';

const SELECT_VALUE_ACCESSOR = new Provider(
    NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => Select), multi: true});


/**
 * @name Select
 * @description
 * The `ion-select` component is similar to an HTML `<select>` element, however,
 * Ionic's select component makes it easier for users to sort through and select
 * the preferred option or options. When users tap the select component, a
 * dialog will appear with all of the options in a large, easy to select list
 * for users.
 *
 * The select component takes child `ion-option` components. If `ion-option` is not
 * given a `value` attribute then it will use its text as the value.
 *
 * ### Interfaces
 *
 * By default, the `ion-select` uses the {@link ../../alert/Alert Alert API} to
 * open up the overlay of options in an alert. The interface can be changed to use the
 * {@link ../../action-sheet/ActionSheet ActionSheet API} by passing `action-sheet` to
 * the `interface` property. Read the other sections for the limitations of the
 * action sheet interface.
 *
 * ### Single Value: Radio Buttons
 *
 * The standard `ion-select` component allows the user to select only one
 * option. When selecting only one option the alert interface presents users with
 * a radio button styled list of options. The action sheet interface can only be
 * used with a single value select. If the number of options exceed 6, it will
 * use the `alert` interface even if `action-sheet` is passed. The `ion-select`
 * component's value receives the value of the selected option's value.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Gender</ion-label>
 *   <ion-select [(ngModel)]="gender">
 *     <ion-option value="f" checked="true">Female</ion-option>
 *     <ion-option value="m">Male</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ### Multiple Value: Checkboxes
 *
 * By adding the `multiple="true"` attribute to `ion-select`, users are able
 * to select multiple options. When multiple options can be selected, the alert
 * overlay presents users with a checkbox styled list of options. The
 * `ion-select multiple="true"` component's value receives an array of all the
 * selected option values. In the example below, because each option is not given
 * a `value`, then it'll use its text as the value instead.
 *
 * Note: the action sheet interface will not work with a multi-value select.
 *
 * ```html
 * <ion-item>
 *   <ion-label>Toppings</ion-label>
 *   <ion-select [(ngModel)]="toppings" multiple="true">
 *     <ion-option>Bacon</ion-option>
 *     <ion-option>Black Olives</ion-option>
 *     <ion-option>Extra Cheese</ion-option>
 *     <ion-option>Mushrooms</ion-option>
 *     <ion-option>Pepperoni</ion-option>
 *     <ion-option>Sausage</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ### Select Buttons
 * By default, the two buttons read `Cancel` and `OK`. Each button's text
 * can be customized using the `cancelText` and `okText` attributes:
 *
 * ```html
 * <ion-select okText="Okay" cancelText="Dismiss">
 *   ...
 * </ion-select>
 * ```
 *
 * The action sheet interface does not have an `OK` button, clicking
 * on any of the options will automatically close the overlay and select
 * that value.
 *
 * ### Alert Options
 *
 * Since `ion-select` is a wrapper to `Alert`, by default, it can be
 * passed options in the `alertOptions` property. This can be used to
 * pass a custom alert title, subtitle or message. See the {@link ../../alert/Alert Alert API docs}
 * for more properties.
 *
 * ```html
 * <ion-select [alertOptions]="alertOptions">
 *   ...
 * </ion-select>
 * ```
 *
 * ```ts
 * this.alertOptions = {
 *   title: 'Pizza Toppings',
 *   subTitle: 'Select your toppings'
 * };
 * ```
 *
 * @demo /docs/v2/demos/select/
 */
@Component({
  selector: 'ion-select',
  template:
    '<div class="select-text">{{_text}}</div>' +
    '<div class="select-icon">' +
      '<div class="select-icon-inner"></div>' +
    '</div>' +
    '<button aria-haspopup="true" ' +
            '[id]="id" ' +
            'category="item-cover" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.select-disabled]': '_disabled'
  },
  providers: [SELECT_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
})
export class Select {
  private _disabled: any = false;
  private _labelId: string;
  private _multi: boolean = false;
  private _options: QueryList<Option>;
  private _values: Array<string> = [];
  private _texts: Array<string> = [];
  private _text: string = '';
  private _fn: Function;
  private _isOpen: boolean = false;

  /**
   * @private
   */
  id: string;

  /**
   * @input {string} The text to display on the cancel button. Default: `Cancel`.
   */
  @Input() cancelText: string = 'Cancel';

  /**
   * @input {string} The text to display on the ok button. Default: `OK`.
   */
  @Input() okText: string = 'OK';

  /**
   * @input {any} Any addition options that the alert interface can take.
   * See the [Alert API docs](../../alert/Alert) for the create options.
   */
  @Input() alertOptions: any = {};

  /**
   * @private
   */
  @Input() checked: any = false;

  /**
   * @input {string} The interface the select should use: `action-sheet` or `alert`. Default: `alert`.
   */
  @Input() interface: string = '';

  /**
   * @output {any} Any expression you want to evaluate when the selection has changed.
   */
  @Output() change: EventEmitter<any> = new EventEmitter();

  /**
   * @output {any} Any expression you want to evaluate when the selection was cancelled.
   */
  @Output() cancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private _form: Form,
    private _elementRef: ElementRef,
    private _renderer: Renderer,
    @Optional() private _item: Item,
    @Optional() private _nav: NavController
  ) {
    this._form.register(this);

    if (_item) {
      this.id = 'sel-' + _item.registerInput('select');
      this._labelId = 'lbl-' + _item.id;
      this._item.setCssClass('item-select', true);
    }

    if (!_nav) {
      console.error('parent <ion-nav> required for <ion-select>');
    }
  }

  @HostListener('click', ['$event'])
  private _click(ev) {
    if (ev.detail === 0) {
      // do not continue if the click event came from a form submit
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    this._open();
  }

  @HostListener('keyup.space', ['$event'])
  private _keyup(ev) {
    if (!this._isOpen) {
      this._open();
    }
  }

  private _open() {
    if (this._disabled) {
      return;
    }

    console.debug('select, open alert');

    // the user may have assigned some options specifically for the alert
    let alertOptions = merge({}, this.alertOptions);

    // make sure their buttons array is removed from the options
    // and we create a new array for the alert's two buttons
    alertOptions.buttons = [{
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.cancel.emit(null);
      }
    }];

    // if the alertOptions didn't provide an title then use the label's text
    if (!alertOptions.title && this._item) {
      alertOptions.title = this._item.getLabelText();
    }

    let options = this._options.toArray();
    if (this.interface === 'action-sheet' && options.length > 6) {
      console.warn('Interface cannot be "action-sheet" with more than 6 options. Using the "alert" interface.');
      this.interface = 'alert';
    }

    if (this.interface === 'action-sheet' && this._multi) {
      console.warn('Interface cannot be "action-sheet" with a multi-value select. Using the "alert" interface.');
      this.interface = 'alert';
    }

    let overlay;
    if (this.interface === 'action-sheet') {

      alertOptions.buttons = alertOptions.buttons.concat(options.map(input => {
        return {
          role: (input.checked ? 'selected' : ''),
          text: input.text,
          handler: () => {
            this.onChange(input.value);
            this.change.emit(input.value);
          }
        };
      }));
      alertOptions.cssClass = 'select-action-sheet';

      overlay = ActionSheet.create(alertOptions);

    } else {
      // default to use the alert interface
      this.interface = 'alert';

      // user cannot provide inputs from alertOptions
      // alert inputs must be created by ionic from ion-options
      alertOptions.inputs = this._options.toArray().map(input => {
        return {
          type: (this._multi ? 'checkbox' : 'radio'),
          label: input.text,
          value: input.value,
          checked: input.checked
        };
      });

      // create the alert instance from our built up alertOptions
      overlay = Alert.create(alertOptions);

      if (this._multi) {
        // use checkboxes
        overlay.setCssClass('select-alert multiple-select-alert');

      } else {
        // use radio buttons
        overlay.setCssClass('select-alert single-select-alert');
      }

      overlay.addButton({
        text: this.okText,
        handler: selectedValues => {
          this.onChange(selectedValues);
          this.change.emit(selectedValues);
        }
      });

    }

    this._nav.present(overlay, alertOptions);

    this._isOpen = true;
    overlay.onDismiss(() => {
      this._isOpen = false;
    });
  }


  /**
   * @input {boolean} Whether or not the select component can accept multiple values. Default: `false`.
   */
  @Input()
  get multiple(): any {
    return this._multi;
  }

  set multiple(val: any) {
    this._multi = isTrueProperty(val);
  }


  /**
   * @private
   */
  get text() {
    return (this._multi ? this._texts : this._texts.join());
  }

  /**
   * @private
   */
  @ContentChildren(Option)
  private set options(val: QueryList<Option>) {
    this._options = val;

    if (!this._values.length) {
      // there are no values set at this point
      // so check to see who should be checked
      this._values = val.toArray().filter(o => o.checked).map(o => o.value);
    }

    this._updOpts();
  }

  /**
   * @private
   */
  private _updOpts() {
    this._texts = [];

    if (this._options) {
      this._options.toArray().forEach(option => {
        // check this option if the option's value is in the values array
        option.checked = this._values.some(selectValue => {
          return isCheckedProperty(selectValue, option.value);
        });

        if (option.checked) {
          this._texts.push(option.text);
        }
      });
    }

    this._text = this._texts.join(', ');
  }

  /**
   * @input {boolean} Whether or not the select component is disabled. Default `false`.
   */
  @Input()
  get disabled() {
    return this._disabled;
  }

  set disabled(val) {
    this._disabled = isTrueProperty(val);
    this._item && this._item.setCssClass('item-select-disabled', this._disabled);
  }

  /**
   * @private
   */
  writeValue(val: any) {
    console.debug('select, writeValue', val);
    this._values = (Array.isArray(val) ? val : isBlank(val) ? [] : [val]);
    this._updOpts();
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    this._updOpts();
  }

  /**
   * @private
   */
  registerOnChange(fn: Function): void {
    this._fn = fn;
    this.onChange = (val: any) => {
      console.debug('select, onChange', val);
      fn(val);
      this._values = (Array.isArray(val) ? val : isBlank(val) ? [] : [val]);
      this._updOpts();
      this.onTouched();
    };
  }

  /**
   * @private
   */
  registerOnTouched(fn) { this.onTouched = fn; }

  /**
   * @private
   */
  onChange(val: any) {
    // onChange used when there is not an ngControl
    console.debug('select, onChange w/out ngControl', val);
    this._values = (Array.isArray(val) ? val : isBlank(val) ? [] : [val]);
    this._updOpts();
    this.onTouched();
  }

  /**
   * @private
   */
  onTouched() { }

  /**
   * @private
   */
  ngOnDestroy() {
    this._form.deregister(this);
  }
}
