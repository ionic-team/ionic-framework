import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Input, HostListener, OnDestroy, Optional, Output, Renderer, QueryList, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ActionSheet } from '../action-sheet/action-sheet';
import { Alert } from '../alert/alert';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { Ion } from '../ion';
import { isBlank, isCheckedProperty, isTrueProperty, merge } from '../../util/util';
import { Item } from '../item/item';
import { NavController } from '../../navigation/nav-controller';
import { Option } from '../option/option';

export const SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Select),
  multi: true
};

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
 * By default, the `ion-select` uses the {@link ../../alert/AlertController AlertController API}
 * to open up the overlay of options in an alert. The interface can be changed to use the
 * {@link ../../action-sheet/ActionSheetController ActionSheetController API} by passing
 * `action-sheet` to the `interface` property. Read the other sections for the limitations of the
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
 *     <ion-option value="f" selected="true">Female</ion-option>
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
 * ### Select Options
 *
 * Since `ion-select` uses the `Alert` and `Action Sheet` interfaces, options can be
 * passed to these components through the `selectOptions` property. This can be used
 * to pass a custom title, subtitle, css class, and more. See the
 * {@link ../../alert/AlertController/#create AlertController API docs} and
 * {@link ../../action-sheet/ActionSheetController/#create ActionSheetController API docs}
 * for the properties that each interface accepts.
 *
 * ```html
 * <ion-select [selectOptions]="selectOptions">
 *   ...
 * </ion-select>
 * ```
 *
 * ```ts
 * this.selectOptions = {
 *   title: 'Pizza Toppings',
 *   subTitle: 'Select your toppings'
 * };
 * ```
 *
 * @demo /docs/v2/demos/src/select/
 */
@Component({
  selector: 'ion-select',
  template:
    '<div *ngIf="!_text" class="select-placeholder select-text">{{placeholder}}</div>' +
    '<div *ngIf="_text" class="select-text">{{selectedText || _text}}</div>' +
    '<div class="select-icon">' +
      '<div class="select-icon-inner"></div>' +
    '</div>' +
    '<button aria-haspopup="true" ' +
            '[id]="id" ' +
            'ion-button="item-cover" ' +
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
export class Select extends Ion implements AfterContentInit, ControlValueAccessor, OnDestroy {
  _disabled: any = false;
  _labelId: string;
  _multi: boolean = false;
  _options: QueryList<Option>;
  _values: string[] = [];
  _texts: string[] = [];
  _text: string = '';
  _fn: Function;
  _isOpen: boolean = false;

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
   * @input {string} The text to display when the select is empty.
   */
  @Input() placeholder: string;

  /**
   * @input {any} Any additional options that the `alert` or `action-sheet` interface can take.
   * See the [AlertController API docs](../../alert/AlertController/#create) and the
   * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) for the
   * create options for each interface.
   */
  @Input() selectOptions: any = {};

  /**
   * @input {string} The interface the select should use: `action-sheet` or `alert`. Default: `alert`.
   */
  @Input() interface: string = '';

  /**
   * @input {string} The text to display instead of the selected option's value.
   */
  @Input() selectedText: string = '';

  /**
   * @input {string} The mode to apply to this component.
   */
  @Input()
  set mode(val: string) {
    this._setMode('select', val);
  }

  /**
   * @output {any} Any expression you want to evaluate when the selection has changed.
   */
  @Output() ionChange: EventEmitter<any> = new EventEmitter();

  /**
   * @output {any} Any expression you want to evaluate when the selection was cancelled.
   */
  @Output() ionCancel: EventEmitter<any> = new EventEmitter();

  constructor(
    private _app: App,
    private _form: Form,
    config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() public _item: Item,
    @Optional() private _nav: NavController
  ) {
    super(config, elementRef, renderer);

    this.mode = config.get('mode');

    _form.register(this);

    if (_item) {
      this.id = 'sel-' + _item.registerInput('select');
      this._labelId = 'lbl-' + _item.id;
      this._item.setElementClass('item-select', true);
    }
  }

  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    if (ev.detail === 0) {
      // do not continue if the click event came from a form submit
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    this.open();
  }

  @HostListener('keyup.space')
  _keyup() {
    if (!this._isOpen) {
      this.open();
    }
  }

  /**
   * Open the select interface.
   */
  open() {
    if (this._disabled) {
      return;
    }

    console.debug('select, open alert');

    // the user may have assigned some options specifically for the alert
    let selectOptions = merge({}, this.selectOptions);

    // make sure their buttons array is removed from the options
    // and we create a new array for the alert's two buttons
    selectOptions.buttons = [{
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit(null);
      }
    }];

    // if the selectOptions didn't provide a title then use the label's text
    if (!selectOptions.title && this._item) {
      selectOptions.title = this._item.getLabelText();
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

    let overlay: any;
    if (this.interface === 'action-sheet') {
      selectOptions.buttons = selectOptions.buttons.concat(options.map(input => {
        return {
          role: (input.selected ? 'selected' : ''),
          text: input.text,
          handler: () => {
            this.onChange(input.value);
            this.ionChange.emit(input.value);
          }
        };
      }));
      var selectCssClass = 'select-action-sheet';

      // If the user passed a cssClass for the select, add it
      selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';

      selectOptions.cssClass = selectCssClass;
      overlay = new ActionSheet(this._app, selectOptions);

    } else {
      // default to use the alert interface
      this.interface = 'alert';

      // user cannot provide inputs from selectOptions
      // alert inputs must be created by ionic from ion-options
      selectOptions.inputs = this._options.map(input => {
        return {
          type: (this._multi ? 'checkbox' : 'radio'),
          label: input.text,
          value: input.value,
          checked: input.selected,
          disabled: input.disabled
        };
      });

      var selectCssClass = 'select-alert';

      // create the alert instance from our built up selectOptions
      overlay = new Alert(this._app, selectOptions);

      if (this._multi) {
        // use checkboxes
        selectCssClass += ' multiple-select-alert';
      } else {
        // use radio buttons
        selectCssClass += ' single-select-alert';
      }

      // If the user passed a cssClass for the select, add it
      selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';
      overlay.setCssClass(selectCssClass);

      overlay.addButton({
        text: this.okText,
        handler: (selectedValues: any) => {
          this.onChange(selectedValues);
          this.ionChange.emit(selectedValues);
        }
      });

    }

    overlay.present(selectOptions);

    this._isOpen = true;
    overlay.onDidDismiss(() => {
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
  set options(val: QueryList<Option>) {
    this._options = val;

    if (!this._values.length) {
      // there are no values set at this point
      // so check to see who should be selected
      this._values = val.filter(o => o.selected).map(o => o.value);
    }

    this._updOpts();
  }

  /**
   * @private
   */
  _updOpts() {
    this._texts = [];

    if (this._options) {
      this._options.forEach(option => {
        // check this option if the option's value is in the values array
        option.selected = this._values.some(selectValue => {
          return isCheckedProperty(selectValue, option.value);
        });

        if (option.selected) {
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
    this._item && this._item.setElementClass('item-select-disabled', this._disabled);
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
  registerOnTouched(fn: any) { this.onTouched = fn; }

  /**
   * @private
   */
  onChange(val: any) {
    // onChange used when there is not an formControlName
    console.debug('select, onChange w/out formControlName', val);
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
