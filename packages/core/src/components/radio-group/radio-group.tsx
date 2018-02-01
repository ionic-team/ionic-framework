import { Component, ComponentDidLoad, Element, Event, EventEmitter, Listen, Prop, State, Watch } from '@stencil/core';
import { HTMLIonRadioElementEvent } from '../radio/radio';
import { InputChangeEvent, RadioGroupInput } from '../../utils/input-interfaces';


@Component({
  tag: 'ion-radio-group'
})
export class RadioGroup implements ComponentDidLoad, RadioGroupInput {
  private didLoad: boolean;
  private radios: HTMLIonRadioElement[] = [];

  @Element() el: HTMLElement;

  @State() labelId: string;

  /*
   * If true, the radios can be deselected. Default false.
   */
  @Prop() allowEmptySelection = false;

  /*
   * If true, the user cannot interact with the radio group. Default false.
   */
  @Prop({ mutable: true }) disabled = false;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop({ mutable: true }) name: string;

  /**
   * the value of the radio group.
   */
  @Prop({ mutable: true }) value: string;

  @Watch('value')
  valueChanged() {
    // this radio group's value just changed
    // double check the button with this value is checked
    if (this.value === undefined) {
      // set to undefined
      // ensure all that are checked become unchecked
      this.radios.filter(r => r.checked).forEach(radio => {
        radio.checked = false;
      });

    } else {
      let hasChecked = false;

      this.radios.forEach(radio => {
        if (radio.value === this.value) {
          if (!radio.checked && !hasChecked) {
            // correct value for this radio
            // but this radio isn't checked yet
            // and we haven't found a checked yet
            // so CHECK IT!
            radio.checked = true;

          } else if (hasChecked && radio.checked) {
            // somehow we've got multiple radios
            // with the same value, but only one can be checked
            radio.checked = false;
          }

          // remember we've got a checked radio button now
          hasChecked = true;

        } else if (radio.checked) {
          // this radio doesn't have the correct value
          // and it's also checked, so let's uncheck it
          radio.checked = false;
        }
      });
    }

    if (this.didLoad) {
      // emit the new value
      this.ionChange.emit({ value: this.value });
    }
  }

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange: EventEmitter<InputChangeEvent>;

  @Listen('ionRadioDidLoad')
  onRadioDidLoad(ev: HTMLIonRadioElementEvent) {
    const radio = ev.target;
    this.radios.push(radio);
    radio.name = this.name;

    if (this.value !== undefined && radio.value === this.value) {
      // this radio-group has a value and this
      // radio equals the correct radio-group value
      // so let's check this radio
      radio.checked = true;

    } else if (this.value === undefined && radio.checked) {
      // this radio-group does not have a value
      // but this radio is checked, so let's set the
      // radio-group's value from the checked radio
      this.value = radio.value;

    } else if (radio.checked) {
      // if it doesn't match one of the above cases, but the
      // radio is still checked, then we need to uncheck it
      radio.checked = false;
    }
  }

  @Listen('ionRadioDidUnload')
  onRadioDidUnload(ev: HTMLIonRadioElementEvent) {
    const index = this.radios.indexOf(ev.target);
    if (index > -1) {
      this.radios.splice(index, 1);
    }
  }

  @Listen('ionSelect')
  onRadioSelect(ev: HTMLIonRadioElementEvent) {
    // ionSelect only come from the checked radio button
    this.radios.forEach(radio => {
      if (radio === ev.target) {
        if (radio.value !== this.value) {
          this.value = radio.value;
        }
      } else {
        radio.checked = false;
      }
    });
  }

  componentWillLoad() {
    this.name = this.name || 'ion-rg-' + (radioGroupIds++);
  }

  componentDidLoad() {
    // Get the list header if it exists and set the id
    // this is used to set aria-labelledby
    let header = this.el.querySelector('ion-list-header');
    if (!header) {
      header = this.el.querySelector('ion-item-divider');
    }
    if (header) {
      const label = header.querySelector('ion-label');
      if (label) {
        this.labelId = label.id = this.name + '-lbl';
      }
    }

    this.didLoad = true;
  }

  hostData() {
    const hostAttrs: any = {
      'role': 'radiogroup'
    };
    if (this.labelId) {
      hostAttrs['aria-labelledby'] = this.labelId;
    }
    return hostAttrs;
  }

  render() {
    return <slot></slot>;
  }
}

let radioGroupIds = 0;
