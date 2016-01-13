import {Component, Directive, Optional, ElementRef, Input, Renderer, HostListener, ContentChild, ContentChildren, QueryList} from 'angular2/core';
import {NgControl} from 'angular2/common';

import {Alert} from '../alert/alert';
import {Form} from '../../util/form';
import {Label} from '../label/label';
import {merge} from '../../util/util';
import {NavController} from '../nav/nav-controller';
import {Option} from '../option/option';

/**
 * @name Select
 * @description
 * The `ion-select` component is similar to an HTML `<select>` element, however,
 * Ionic's select component makes it easier for users to sort through and select
 * the preferred option or options. When users tap the select component, a
 * dialog will appear with all of the options in a large, easy to select list
 * for users.
 *
 * Under-the-hood the `ion-select` actually uses the
 * {@link ../../alert/Alert Alert API} to open up the overlay of options
 * which the user is presented with. Select takes one child `ion-label`
 * component, and numerous child `ion-option` components. Each `ion-option`
 * should be given a `value` attribute.
 *
 * ### Single Value: Radio Buttons
 *
 * The standard `ion-select` component allows the user to select only one
 * option. When selecting only one option the alert overlay presents users with
 * a radio button styled list of options. The `ion-select` component's value
 * receives the value of the selected option's value.
 *
 * ```html
 * <ion-select [(ngModel)]="gender">
 *   <ion-label>Gender</ion-label>
 *   <ion-option value="f" checked="true">Female</ion-option>
 *   <ion-option value="m">Male</ion-option>
 * </ion-select>
 * ```
 *
 * ### Multiple Value: Checkboxes
 *
 * By adding the `multiple="true"` attribute to `ion-select`, users are able
 * to select multiple options. When multiple options can be selected, the alert
 * overlay presents users with a checkbox styled list of options. The
 * `ion-select multiple="true"` component's value receives an array of all the
 * selected option values.
 *
 * ```html
 * <ion-select [(ngModel)]="toppings" multiple="true">
 *   <ion-label>Toppings</ion-label>
 *   <ion-option value="bacon">Bacon</ion-option>
 *   <ion-option value="olives">Black Olives</ion-option>
 *   <ion-option value="xcheese">Extra Cheese</ion-option>
 *   <ion-option value="mushrooms">Mushrooms</ion-option>
 *   <ion-option value="pepperoni">Pepperoni</ion-option>
 *   <ion-option value="sausage">Sausage</ion-option>
 * </ion-select>
 * ```
 *
 * ### Alert Buttons
 * By default, the two buttons read `Cancel` and `OK`. The each button's text
 * can be customized using the `cancelText` and `okText` attributes:
 *
 * ```html
 * <ion-select okText="Okay" cancelText="Dismiss">
 *   ...
 * </ion-select>
 * ```
 *
 * ### Alert Options
 *
 * Remember how `ion-select` is really just a wrapper to `Alert`? By using
 * the `alertOptions` property you can pass custom options to the alert
 * overlay. This would be useful if there is a custom alert title,
 * subtitle or message. {@link ../../alert/Alert Alert API}
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
 */
@Component({
  selector: 'ion-select',
  host: {
    'class': 'item',
    'tappable': '',
    'tabindex': '0',
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
  private selectedText: string = '';
  private labelId: string;

  @Input() cancelText: string = 'Cancel';
  @Input() okText: string = 'OK';
  @Input() value: string = '';
  @Input() alertOptions: any = {};
  @Input() checked: any = false;
  @Input() disabled: boolean = false;
  @Input() id: string = '';
  @Input() multiple: string = '';

  @ContentChild(Label) label: Label;
  @ContentChildren(Option) options: QueryList<Option>;

  constructor(
    private form: Form,
    private elementRef: ElementRef,
    private renderer: Renderer,
    @Optional() private navCtrl: NavController,
    @Optional() ngControl: NgControl
  ) {
    this.form.register(this);

    if (ngControl) {
      ngControl.valueAccessor = this;
    }

    if (!navCtrl) {
      console.error('parent <ion-nav> required for <ion-select>');
    }
  }

  /**
   * @private
   */
  ngOnInit() {
    if (!this.id) {
      this.id = 'sel-' + this.form.nextId();
      this.renderer.setElementAttribute(this.elementRef, 'id', this.id);
    }

    this.labelId = 'lbl-' + this.id;
    this.renderer.setElementAttribute(this.elementRef, 'aria-labelledby', this.labelId);
  }

  /**
   * @private
   */
  ngAfterContentInit() {
    var selectedOption = this.options.toArray().find(o => o.checked);

    if (!selectedOption) {
      this.options.toArray().forEach(o => {
        o.checked = o.value === this.value + '';
        if (o.checked) {
          selectedOption = o;
        }
      });
    } else {
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
    let isMulti = this.multiple === 'true';

    // the user may have assigned some options specifically for the alert
    let alertOptions = merge({}, this.alertOptions);

    // make sure their buttons array is removed from the options
    // and we create a new array for the alert's two buttons
    alertOptions.buttons = [this.cancelText];

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
        text: this.okText,
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
        text: this.okText,
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

    this.navCtrl.present(alert);
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
    this.form.deregister(this);
  }
}
