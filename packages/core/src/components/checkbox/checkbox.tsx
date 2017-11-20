import { BlurEvent, BooleanInput, BooleanInputChangeEvent, FocusEvent, StyleEvent } from '../../utils/input-interfaces';
import { Component, CssClassMap, Event, EventEmitter, Listen, Prop, PropDidChange } from '@stencil/core';

/**
 * @name Checkbox
 * @module ionic
 *
 * @description
 * placed in an `ion-item` or used as a stand-alone checkbox.
 *
 * See the [Angular Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 *
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-checkbox [(ngModel)]="pepperoni"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-checkbox [(ngModel)]="sausage" disabled="true"></ion-checkbox>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-checkbox [(ngModel)]="mushrooms"></ion-checkbox>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * @advanced
 *
 * ```html
 *
 * <!-- Call function when state changes -->
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Cucumber</ion-label>
 *      <ion-checkbox [(ngModel)]="cucumber" (ionChange)="updateCucumber()"></ion-checkbox>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * ```ts
 * @Component({
 *   templateUrl: 'main.html'
 * })
 * class SaladPage {
 *   cucumber: boolean;
 *
 *   updateCucumber() {
 *     console.log('Cucumbers new state:' + this.cucumber);
 *   }
 * }
 * ```
 *
 * @demo /docs/demos/src/checkbox/
 * @see {@link /docs/components#checkbox Checkbox Component Docs}
 */
@Component({
  tag: 'ion-checkbox',
  styleUrls: {
    ios: 'checkbox.ios.scss',
    md: 'checkbox.md.scss'
  },
  host: {
    theme: 'checkbox'
  }
})
export class Checkbox implements BooleanInput {
  private checkboxId: string;
  private labelId: string;
  private styleTmr: any;

  /**
   * @output {Event} Emitted when the checked property has changed.
   */
  @Event() ionChange: EventEmitter<BooleanInputChangeEvent>;

  /**
   * @output {Event} Emitted when the toggle has focus.
   */
  @Event() ionFocus: EventEmitter<FocusEvent>;

  /**
   * @output {Event} Emitted when the toggle loses focus.
   */
  @Event() ionBlur: EventEmitter<BlurEvent>;

  /**
   * @output {Event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter<StyleEvent>;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * @input {boolean} If true, the checkbox is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked: boolean = false;

  /*
   * @input {boolean} If true, the user cannot interact with the checkbox. Default false.
   */
  @Prop({ mutable: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the checkbox.
   */
  @Prop({ mutable: true }) value: string;


  protected ionViewWillLoad() {
    this.emitStyle();
  }

  @PropDidChange('checked')
  protected checkedChanged(val: boolean) {
    this.ionChange.emit({ checked: val });
    this.emitStyle();
  }

  @PropDidChange('disabled')
  protected disabledChanged() {
    this.emitStyle();
  }

  private emitStyle() {
    clearTimeout(this.styleTmr);

    this.styleTmr = setTimeout(() => {
      this.ionStyle.emit({
        'checkbox-disabled': this.disabled,
        'checkbox-checked': this.checked,
      });
    });
  }


  @Listen('keydown.space')
  onSpace(ev: KeyboardEvent) {
    this.toggle();
    ev.stopPropagation();
    ev.preventDefault();
  }

  toggle() {
    this.checked = !this.checked;
  }

  hostData() {
    return {
      class: {
        'checkbox-checked': this.checked,
        'checkbox-disabled': this.disabled
      }
    };
  }

  protected render() {
    const checkboxClasses: CssClassMap = {
      'checkbox-icon': true,
      'checkbox-checked': this.checked
    };

    return [
      <div class={checkboxClasses}>
        <div class='checkbox-inner'></div>
      </div>,
      <button
        class='checkbox-cover'
        onClick={() => this.toggle()}
        id={this.checkboxId}
        aria-checked={this.checked ? 'true' : false}
        aria-disabled={this.disabled ? 'true' : false}
        aria-labelledby={this.labelId}
        role='checkbox'
        tabIndex={0}
      />
    ];
  }
}
