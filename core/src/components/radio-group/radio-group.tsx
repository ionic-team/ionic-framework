import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Listen, Prop, Watch, h } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';
import { RadioGroupChangeEventDetail } from '../../interface';

@Component({
  tag: 'ion-radio-group'
})
export class RadioGroup implements ComponentInterface {

  private inputId = `ion-rg-${radioGroupIds++}`;
  private labelId = `${this.inputId}-lbl`;
  private label?: HTMLIonLabelElement | null;

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
    this.setRadioTabindex(value);

    this.ionChange.emit({ value });
  }

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<RadioGroupChangeEventDetail>;

  componentDidLoad() {
    this.setRadioTabindex(this.value);
  }

  private setRadioTabindex = (value: any | undefined) => {
    const radios = this.getRadios();

    // Get the first radio that is not disabled and the checked one
    const first = radios.find(radio => !radio.disabled);
    const checked = radios.find(radio => (radio.value === value && !radio.disabled));

    if (!first && !checked) {
      return;
    }

    // If an enabled checked radio exists, set it to be the focusable radio
    // otherwise we default to focus the first radio
    const focusable = checked || first;

    for (const radio of radios) {
      const tabindex = radio === focusable ? 0 : -1;
      radio.setButtonTabindex(tabindex);
    }
  }

  async connectedCallback() {
    // Get the list header if it exists and set the id
    // this is used to set aria-labelledby
    const header = this.el.querySelector('ion-list-header') || this.el.querySelector('ion-item-divider');
    if (header) {
      const label = this.label = header.querySelector('ion-label');
      if (label) {
        this.labelId = label.id = this.name + '-lbl';
      }
    }
  }

  private getRadios(): HTMLIonRadioElement[] {
    return Array.from(this.el.querySelectorAll('ion-radio'));
  }

  private onClick = (ev: Event) => {
    ev.preventDefault();

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

  @Listen('keydown', { target: 'document' })
  onKeydown(ev: any) {
    const inSelectPopover = !!this.el.closest('ion-select-popover');

    if (ev.target && !this.el.contains(ev.target)) {
      return;
    }

    // Get all radios inside of the radio group and then
    // filter out disabled radios since we need to skip those
    const radios = Array.from(this.el.querySelectorAll('ion-radio')).filter(radio => !radio.disabled);

    // Only move the radio if the current focus is in the radio group
    if (ev.target && radios.includes(ev.target)) {
      const index = radios.findIndex(radio => radio === ev.target);
      const current = radios[index];

      let next;

      // If hitting arrow down or arrow right, move to the next radio
      // If we're on the last radio, move to the first radio
      if (['ArrowDown', 'ArrowRight'].includes(ev.code)) {
        next = (index === radios.length - 1)
          ? radios[0]
          : radios[index + 1];
      }

      // If hitting arrow up or arrow left, move to the previous radio
      // If we're on the first radio, move to the last radio
      if (['ArrowUp', 'ArrowLeft'].includes(ev.code)) {
        next = (index === 0)
          ? radios[radios.length - 1]
          : radios[index - 1];
      }

      if (next && radios.includes(next)) {
        next.setFocus(ev);

        if (!inSelectPopover) {
          this.value = next.value;
        }
      }

      // Update the radio group value when a user presses the
      // space bar on top of a selected radio (only applies
      // to radios in a select popover)
      if (['Space'].includes(ev.code)) {
        this.value = current.value;

        // Prevent browsers from jumping
        // to the bottom of the screen
        ev.preventDefault();
      }
    }
  }

  render() {
    const { label, labelId } = this;
    const mode = getIonMode(this);

    return (
      <Host
        role="radiogroup"
        aria-labelledby={label ? labelId : null}
        onClick={this.onClick}
        class={mode}
      >
      </Host>
    );
  }
}

let radioGroupIds = 0;
