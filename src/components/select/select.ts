import { Component, ContentChildren, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Optional, Output, QueryList, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ActionSheet } from '../action-sheet/action-sheet';
import { Alert } from '../alert/alert';
import { Popover } from '../popover/popover';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { Overlay } from '../../navigation/overlay';
import { Form } from '../../util/form';
import { BaseInput } from '../../util/base-input';
import { assert, deepCopy, deepEqual, isCheckedProperty, isTrueProperty } from '../../util/util';
import { Item } from '../item/item';
import { Option } from '../option/option';
import { SelectPopover, SelectPopoverOption } from './select-popover-component';

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
 * If `ngModel` is bound to `ion-select`, the selected value will be based on the
 * bound value of the model. Otherwise, the `selected` attribute can be used on
 * `ion-option` components.
 *
 * ### Interfaces
 *
 * By default, the `ion-select` uses the {@link ../../alert/AlertController AlertController API}
 * to open up the overlay of options in an alert. The interface can be changed to use the
 * {@link ../../action-sheet/ActionSheetController ActionSheetController API} or
 * {@link ../../popover/PopoverController PopoverController API} by passing `action-sheet` or `popover`,
 * respectively, to the `interface` property. Read on to the other sections for the limitations
 * of the different interfaces.
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
 *     <ion-option value="f">Female</ion-option>
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
 * Note: the `action-sheet` and `popover` interfaces will not work with a multi-value select.
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
 * The `action-sheet` and `popover` interfaces do not have an `OK` button, clicking
 * on any of the options will automatically close the overlay and select
 * that value.
 *
 * ### Select Options
 *
 * Since `ion-select` uses the `Alert`, `Action Sheet` and `Popover` interfaces, options can be
 * passed to these components through the `selectOptions` property. This can be used
 * to pass a custom title, subtitle, css class, and more. See the
 * {@link ../../alert/AlertController/#create AlertController API docs},
 * {@link ../../action-sheet/ActionSheetController/#create ActionSheetController API docs}, and
 * {@link ../../popover/PopoverController/#create PopoverController API docs}
 * for the properties that each interface accepts.
 *
 * For example, to change the `mode` of the overlay, pass it into `selectOptions`.
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
 *   subTitle: 'Select your toppings',
 *   mode: 'md'
 * };
 * ```
 *
 * ### Object Value References
 *
 * When using objects for select values, it is possible for the identities of these objects to
 * change if they are coming from a server or database, while the selected value's identity
 * remains the same. For example, this can occur when an existing record with the desired object value
 * is loaded into the select, but the newly retrieved select options now have different identities. This will
 * result in the select appearing to have no value at all, even though the original selection in still intact.
 *
 * Using the `compareWith` `Input` is the solution to this problem
 *
 * ```html
 * <ion-item>
 *   <ion-label>Employee</ion-label>
 *   <ion-select [(ngModel)]="employee" [compareWith]="compareFn">
 *     <ion-option *ngFor="let employee of employees" [value]="employee">{{employee.name}}</ion-option>
 *   </ion-select>
 * </ion-item>
 * ```
 *
 * ```ts
 * compareFn(e1: Employee, e2: Employee): boolean {
 *   return e1 && e2 ? e1.id === e2.id : e1 === e2;
 * }
 * ```
 *
 * @demo /docs/demos/src/select/
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
            'type="button" ' +
            '[id]="id" ' +
            'ion-button="item-cover" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
    '</button>',
  host: {
    '[class.select-disabled]': '_disabled'
  },
  providers: [ { provide: NG_VALUE_ACCESSOR, useExisting: Select, multi: true } ],
  encapsulation: ViewEncapsulation.None,
})
export class Select extends BaseInput<any> implements OnDestroy {

  _multi: boolean = false;
  _options: QueryList<Option>;
  _overlay: Overlay;
  _texts: string[] = [];
  _text: string = '';
  _compareWith: (o1: any, o2: any) => boolean = isCheckedProperty;

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
   * @input {string} The interface the select should use: `action-sheet`, `popover` or `alert`. Default: `alert`.
   */
  @Input() interface: string = '';

  /**
   * @input {string} The text to display instead of the selected option's value.
   */
  @Input() selectedText: string = '';

  /**
   * @input {Function} The function that will be called to compare object values
   */
  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }


  /**
   * @output {any} Emitted when the selection was cancelled.
   */
  @Output() ionCancel: EventEmitter<Select> = new EventEmitter();

  constructor(
    private _app: App,
    form: Form,
    public config: Config,
    elementRef: ElementRef,
    renderer: Renderer,
    @Optional() item: Item,
    public deepLinker: DeepLinker
  ) {
    super(config, elementRef, renderer, 'select', [], form, item, null);
  }

  @HostListener('click', ['$event'])
  _click(ev: UIEvent) {
    ev.preventDefault();
    ev.stopPropagation();
    this.open(ev);
  }

  @HostListener('keyup.space')
  _keyup() {
    this.open();
  }

  /**
   * @hidden
   */
  getValues(): any[] {
    const values = Array.isArray(this._value) ? this._value : [this._value];
    assert(this._multi || values.length <= 1, 'single only can have one value');
    return values;
  }

  /**
   * Open the select interface.
   */
  open(ev?: UIEvent) {
    if (this.isFocus() || this._disabled) {
      return;
    }

    console.debug('select, open alert');

    // the user may have assigned some options specifically for the alert
    const selectOptions = deepCopy(this.selectOptions);

    // make sure their buttons array is removed from the options
    // and we create a new array for the alert's two buttons
    selectOptions.buttons = [{
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit(this);
      }
    }];

    // if the selectOptions didn't provide a title then use the label's text
    if (!selectOptions.title && this._item) {
      selectOptions.title = this._item.getLabelText();
    }

    let options = this._options.toArray();

    if ((this.interface === 'action-sheet' || this.interface === 'popover') && this._multi) {
      console.warn('Interface cannot be "' + this.interface + '" with a multi-value select. Using the "alert" interface.');
      this.interface = 'alert';
    }

    if (this.interface === 'popover' && !ev) {
      console.warn('Interface cannot be "popover" without UIEvent.');
      this.interface = 'alert';
    }

    let overlay: Overlay;

    if (this.interface === 'action-sheet') {
      selectOptions.buttons = selectOptions.buttons.concat(options.map(input => {
        return {
          role: (input.selected ? 'selected' : ''),
          text: input.text,
          handler: () => {
            this.value = input.value;
            input.ionSelect.emit(input.value);
          }
        };
      }));
      var selectCssClass = 'select-action-sheet';

      // If the user passed a cssClass for the select, add it
      selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';

      selectOptions.cssClass = selectCssClass;
      overlay = new ActionSheet(this._app, selectOptions, this.config);

    } else if (this.interface === 'popover') {
      let popoverOptions: SelectPopoverOption[] = options.map(input => ({
        text: input.text,
        checked: input.selected,
        disabled: input.disabled,
        value: input.value,
        handler: () => {
          this.value = input.value;
          input.ionSelect.emit(input.value);
        }
      }));

      var popoverCssClass = 'select-popover';

      // If the user passed a cssClass for the select, add it
      popoverCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';

      overlay = new Popover(this._app, SelectPopover, {
        options: popoverOptions
      }, {
        cssClass: popoverCssClass
      }, this.config, this.deepLinker);

      // ev.target is readonly.
      // place popover regarding to ion-select instead of .button-inner
      Object.defineProperty(ev, 'target', { value: ev.currentTarget });
      selectOptions.ev = ev;

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
          disabled: input.disabled,
          handler: (selectedOption: any) => {
            // Only emit the select event if it is being checked
            // For multi selects this won't emit when unchecking
            if (selectedOption.checked) {
              input.ionSelect.emit(input.value);
            }
          }
        };
      });

      let selectCssClass = 'select-alert';

      // create the alert instance from our built up selectOptions
      overlay = new Alert(this._app, selectOptions, this.config);

      if (this._multi) {
        // use checkboxes
        selectCssClass += ' multiple-select-alert';
      } else {
        // use radio buttons
        selectCssClass += ' single-select-alert';
      }

      // If the user passed a cssClass for the select, add it
      selectCssClass += selectOptions.cssClass ? ' ' + selectOptions.cssClass : '';
      (overlay as Alert).setCssClass(selectCssClass);

      (overlay as Alert).addButton({
        text: this.okText,
        handler: (selectedValues: any) => this.value = selectedValues
      });

    }

    overlay.present(selectOptions);

    this._fireFocus();

    overlay.onDidDismiss(() => {
      this._fireBlur();
      this._overlay = undefined;
    });

    this._overlay = overlay;
  }

  /**
   * Close the select interface.
   */
  close(): Promise<any> {
    if (!this._overlay || !this.isFocus()) {
      return;
    }

    return this._overlay.dismiss();
  }

  /**
   * @input {boolean} If true, the element can accept multiple values.
   */
  @Input()
  get multiple(): any {
    return this._multi;
  }

  set multiple(val: any) {
    this._multi = isTrueProperty(val);
  }


  /**
   * @hidden
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
    const values = this.getValues();
    if (values.length === 0) {
      // there are no values set at this point
      // so check to see who should be selected
      // we use writeValue() because we don't want to update ngModel
      this.writeValue(val.filter(o => o.selected).map(o => o.value));
    } else {
      this._updateText();
    }
  }

  _inputShouldChange(val: string[]|string): boolean {
    return !deepEqual(this._value, val);
  }

  /**
   * TODO: REMOVE THIS
   * @hidden
   */
  _inputChangeEvent(): any {
    return this.value;
  }

  /**
   * @hidden
   */
  _updateText() {
    this._texts.length = 0;

    if (this._options) {
      this._options.forEach(option => {
        // check this option if the option's value is in the values array
        option.selected = this.getValues().some(selectValue => {
          return this._compareWith(selectValue, option.value);
        });

        if (option.selected) {
          this._texts.push(option.text);
        }
      });
    }

    this._text = this._texts.join(', ');
  }

  /**
   * @hidden
   */
  _inputUpdated() {
    this._updateText();
    super._inputUpdated();
  }

}
