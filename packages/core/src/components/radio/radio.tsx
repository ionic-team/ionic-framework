import { Component, CssClassMap, Event, EventEmitter, Listen, Prop, PropDidChange, State } from '@stencil/core';

import { createThemedClasses } from '../../utils/theme';


/**
 * @description
 * A radio button is a button that can be either checked or unchecked. A user can tap
 * the button to check or uncheck it. It can also be checked from the template using
 * the `checked` property.
 *
 * Use an element with a `radio-group` attribute to group a set of radio buttons. When
 * radio buttons are inside a [radio group](../RadioGroup), exactly one radio button
 * in the group can be checked at any time. If a radio button is not placed in a group,
 * they will all have the ability to be checked at the same time.
 *
 * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html) for
 * more information on forms and input.
 *
 * @usage
 * ```html
 * <ion-list radio-group [(ngModel)]="relationship">
 *   <ion-item>
 *     <ion-label>Friends</ion-label>
 *     <ion-radio value="friends" checked></ion-radio>
 *   </ion-item>
 *   <ion-item>
 *     <ion-label>Family</ion-label>
 *     <ion-radio value="family"></ion-radio>
 *   </ion-item>
 *   <ion-item>
 *     <ion-label>Enemies</ion-label>
 *     <ion-radio value="enemies" [disabled]="isDisabled"></ion-radio>
 *   </ion-item>
 * </ion-list>
 * ```
 * @demo /docs/demos/src/radio/
 * @see {@link /docs/components#radio Radio Component Docs}
 * @see {@link ../RadioGroup RadioGroup API Docs}
 */
@Component({
  tag: 'ion-radio',
  styleUrls: {
    ios: 'radio.ios.scss',
    md: 'radio.md.scss'
  },
  host: {
    theme: 'radio'
  }
})
export class Radio {
  labelId: string;
  styleTmr: any;

  @State() radioId: string;

  @State() activated: boolean;

  /**
   * @output {RadioEvent} Emitted when the radio loads.
   */
  @Event() ionRadioDidLoad: EventEmitter;

  /**
   * @output {RadioEvent} Emitted when the radio unloads.
   */
  @Event() ionRadioDidUnload: EventEmitter;

  /**
   * @output {RadioEvent} Emitted when the radio is toggled.
   */
  @Event() ionRadioDidToggle: EventEmitter;

  /**
   * @output {RadioEvent} Emitted when the radio checked property is changed.
   */
  @Event() ionRadioCheckedDidChange: EventEmitter;

  /**
   * @output {Event} Emitted when the styles change.
   */
  @Event() ionStyle: EventEmitter;

  /**
   * @output {Event} Emitted when the radio is selected.
   */
  @Event() ionSelect: EventEmitter;

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
   * @input {boolean} If true, the radio is selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) checked: boolean = false;

  /*
   * @input {boolean} If true, the user cannot interact with the radio. Default false.
   */
  @Prop({ mutable: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the radio.
   */
  @Prop({ mutable: true }) value: string;

  protected ionViewWillLoad() {
    this.emitStyle();
  }

  protected ionViewDidLoad() {
    this.ionRadioDidLoad.emit({ radio: this });
  }

  protected ionViewDidUnload() {
    this.ionRadioDidUnload.emit({ radio: this });
  }

  @PropDidChange('color')
  protected colorChanged() {
    this.emitStyle();
  }

  @PropDidChange('checked')
  protected checkedChanged(val: boolean) {
    this.ionRadioCheckedDidChange.emit({ radio: this });
    this.ionSelect.emit({ checked: val });
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
        ...createThemedClasses(this.mode, this.color, 'radio'),
        'radio-checked': this.checked,
        'radio-disabled': this.disabled,
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
    this.ionRadioDidToggle.emit({ radio: this });
  }

  hostData() {
    return {
      class: {
        'radio-checked': this.checked,
        'radio-disabled': this.disabled
      }
    };
  }

  protected render() {
    const radioClasses: CssClassMap = {
      'radio-icon': true,
      'radio-checked': this.checked
    };

    return [
      <div class={radioClasses}>
        <div class='radio-inner'></div>
      </div>,
      <button
        class='radio-cover'
        onClick={() => this.toggle()}
        id={this.radioId}
        aria-checked={this.checked ? 'true' : false}
        aria-disabled={this.disabled ? 'true' : false}
        aria-labelledby={this.labelId}
        role='radio'
        tabIndex={0}
      />
    ];
  }
}

export interface RadioEvent extends Event {
  detail: {
    radio: Radio;
  };
}
