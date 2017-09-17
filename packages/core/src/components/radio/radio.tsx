import { Component, CssClassMap, Element, Event, EventEmitter, Listen, Prop, PropDidChange, State } from '@stencil/core';

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
    md: 'radio.md.scss',
    wp: 'radio.wp.scss'
  },
  host: {
    theme: 'radio'
  }
})
export class Radio {
  mode: string;
  color: string;
  labelId: string;
  styleTmr: any;

  @Element() el: HTMLElement;

  @State() id: string;

  @State() activated: boolean;

  /**
   * @output {EventEmitter} Emitted when the radio loads.
   */
  @Event() ionRadioDidLoad: EventEmitter;

  /**
   * @output {EventEmitter} Emitted when the radio unloads.
   */
  @Event() ionRadioDidUnload: EventEmitter;

  /**
   * @output {EventEmitter} Emitted when the radio is toggled.
   */
  @Event() ionRadioDidToggle: EventEmitter;

  /**
   * @output {EventEmitter} Emitted when the radio checked property is changed.
   */
  @Event() ionRadioCheckedDidChange: EventEmitter;

  /**
   * @output {EventEmitter} Emitted when the styles of the radio change.
   */
  @Event() ionStyle: EventEmitter;

  /**
   * @output {EventEmitter} Emitted when the radio is selected.
   */
  @Event() ionSelect: EventEmitter;

  /*
   * @input {boolean} If true, the radio is checked. Default false.
   */
  @Prop({ mutable: true }) checked: boolean = false;

  /*
    * @input {boolean} If true, the user cannot interact with this element. Default false.
    */
  @Prop({ mutable: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the radio.
   */
  @Prop({ mutable: true }) value: string;

  ionViewWillLoad() {
    this.emitStyle();
  }

  ionViewDidLoad() {
    this.ionRadioDidLoad.emit({ radio: this });
  }

  @PropDidChange('color')
  colorChanged() {
    this.emitStyle();
  }

  @PropDidChange('checked')
  checkedChanged(val: boolean) {
    this.ionRadioCheckedDidChange.emit({ radio: this });
    this.ionSelect.emit({ checked: val });
    this.emitStyle();
  }

  @PropDidChange('disabled')
  disabledChanged() {
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

  render() {
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
        id={this.id}
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
