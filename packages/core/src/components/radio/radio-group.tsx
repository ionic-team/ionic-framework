import { Component, Element, Event, EventEmitter, Listen, Prop, PropDidChange, State} from '@stencil/core';

import { isCheckedProperty } from '../../utils/helpers';

import { Radio } from './radio';

import { ComponentDetail, ComponentEvent } from '../../index';

/**
 * @name RadioGroup
 * @description
 * A radio group is a group of [radio buttons](../RadioButton). It allows
 * a user to select at most one radio button from a set. Checking one radio
 * button that belongs to a radio group unchecks any previous checked
 * radio button within the same group.
 *
 * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more information on forms and inputs.
 *
 * @usage
 * ```html
 * <ion-list radio-group [(ngModel)]="autoManufacturers">
 *
 *   <ion-list-header>
 *     Auto Manufacturers
 *   </ion-list-header>
 *
 *   <ion-item>
 *     <ion-label>Cord</ion-label>
 *     <ion-radio value="cord"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Duesenberg</ion-label>
 *     <ion-radio value="duesenberg"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Hudson</ion-label>
 *     <ion-radio value="hudson"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Packard</ion-label>
 *     <ion-radio value="packard"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Studebaker</ion-label>
 *     <ion-radio value="studebaker"></ion-radio>
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * @demo /docs/demos/src/radio/
 * @see {@link /docs/components#radio Radio Component Docs}
 * @see {@link ../RadioButton RadioButton API Docs}
*/
@Component({
  tag: 'ion-radio-group'
})
export class RadioGroup {
  radios: Radio[] = [];
  radioGroupId: number;
  ids = 0;

  @Element() private el: HTMLElement;

  @State() activeId: string;
  @State() headerId: string;


  /**
   * @output {ComponentEvent} Emitted when the value has changed.
   */
  @Event() ionChange: EventEmitter<ComponentDetail<RadioGroup>>;

  /*
   * @input {boolean} If true, the radios can be deselected. Default false.
   */
  @Prop() allowEmptySelection: boolean = false;

  /*
   * @input {boolean} If true, the user cannot interact with the radio group. Default false.
   */
  @Prop({ mutable: true }) disabled: boolean = false;

  /**
   * @input {string} the value of the radio group.
   */
  @Prop({ mutable: true }) value: string;

  @PropDidChange('value')
  protected valueChanged() {
    this.update();
    this.ionChange.emit({ component: this });
  }

  @Listen('ionRadioDidLoad')
  protected radioDidLoad(ev: ComponentEvent<Radio>) {
    const radio = ev.detail.component;
    this.radios.push(radio);
    radio.radioId = 'rb-' + this.radioGroupId + '-' + (++this.ids);

    // if the value is not defined then use its unique id
    radio.value = !radio.value ? radio.radioId : radio.value;

    if (radio.checked && !this.value) {
      this.value = radio.value;
    }
  }

  @Listen('ionRadioCheckedDidChange')
  protected radioCheckedDidChange(ev: ComponentEvent<Radio>) {
    const radio = ev.detail.component;

    // TODO shouldn't be able to set radio checked to false
    // if allowEmptySelection is false
    if (radio.checked && this.value !== radio.value) {
      this.value = radio.checked ? radio.value : '';
    }
  }

  @Listen('ionRadioDidToggle')
  protected radioDidToggle(ev: ComponentEvent<Radio>) {
    const radio = ev.detail.component;

    // If the group does not allow empty selection then checked
    // should be true, otherwise leave it as is
    radio.checked = this.allowEmptySelection ? radio.checked : true;
    this.value = radio.checked ? radio.value : '';
  }

  protected ionViewWillLoad() {
    this.radioGroupId = ++radioGroupIds;

    // Get the list header if it exists and set the id
    const header = this.el.querySelector('ion-list-header');

    if (header) {
      if (!header.id) {
        header.id = 'rg-hdr-' + this.radioGroupId;
      }
      this.headerId = header.id;
    }

  }


  /**
   * @hidden
   */
  update() {
    // loop through each of the radios
    let hasChecked = false;
    this.radios.forEach((radio: Radio) => {

      // Check the radio if the value is the same as the group value
      radio.checked = isCheckedProperty(this.value, radio.value) && !hasChecked;

      if (radio.checked) {
        // if this button is checked, then set it as
        // the radiogroup's active descendant
        this.activeId = radio.radioId;
        hasChecked = true;
      }
    });
  }

  hostData() {
    return {
      'role': 'radiogroup',
      'aria-activedescendant': this.activeId,
      'aria-describedby': this.headerId
    };
  }

  protected render() {
    return <slot></slot>;
  }
}

let radioGroupIds = -1;
