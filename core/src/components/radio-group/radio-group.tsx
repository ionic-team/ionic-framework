import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { RadioGroupChangeEventDetail } from '../../interface';

@Component({
  tag: 'ion-radio-group'
})
export class RadioGroup implements ComponentInterface {

  private inputId = `ion-rg-${radioGroupIds++}`;
  private labelId = `${this.inputId}-lbl`;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the radios can be deselected.
   */
  @Prop() allowEmptySelection = false;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * the value of the radio group.
   */
  @Prop({ mutable: true }) value?: any | null;

  @Watch('value')
  valueChanged(value: any | undefined) {
    this.ionChange.emit({ value });
  }

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<RadioGroupChangeEventDetail>;

  async connectedCallback() {
    // Get the list header if it exists and set the id
    // this is used to set aria-labelledby
    const el = this.el;
    const header = el.querySelector('ion-list-header') || el.querySelector('ion-item-divider');
    if (header) {
      const label = header.querySelector('ion-label');
      if (label) {
        this.labelId = label.id = this.name + '-lbl';
      }
    }
  }

  private onClick = (ev: Event) => {
    const selectedRadio = ev.target && (ev.target as HTMLElement).closest('ion-radio');
    if (selectedRadio) {
      const currentValue = this.value;
      const newValue = selectedRadio.value;
      if (newValue !== currentValue) {
        this.value = newValue;
      } else if (this.allowEmptySelection) {
        this.value = undefined;
      }
    }
  }

  render() {
    return (
      <Host
        role="radiogroup"
        aria-labelledby={this.labelId}
        onClick={this.onClick}
        class={getIonMode(this)}
      >
      </Host>
    );
  }
}

let radioGroupIds = 0;
