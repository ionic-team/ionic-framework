import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Component, Element, Event, Host, Listen, Prop, Watch, h } from '@stencil/core';
import { renderHiddenInput } from '@utils/helpers';

import { getIonTheme } from '../../global/ionic-global';

import type { RadioGroupChangeEventDetail, RadioGroupCompareFn } from './radio-group-interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-radio-group',
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
   * This property allows developers to specify a custom function or property
   * name for comparing objects when determining the selected option in the
   * ion-radio-group. When not specified, the default behavior will use strict
   * equality (===) for comparison.
   */
  @Prop() compareWith?: string | RadioGroupCompareFn | null;

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
    this.ionValueChange.emit({ value });
  }

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<RadioGroupChangeEventDetail>;

  /**
   * Emitted when the `value` property has changed.
   * This is used to ensure that `ion-radio` can respond
   * to any value property changes from the group.
   *
   * @internal
   */
  @Event() ionValueChange!: EventEmitter<RadioGroupChangeEventDetail>;

  componentDidLoad() {
    /**
     * There's an issue when assigning a value to the radio group
     * within the Angular primary content (rendering within the
     * app component template). When the template is isolated to a route,
     * the value is assigned correctly.
     * To address this issue, we need to ensure that the watcher is
     * called after the component has finished loading,
     * allowing the emit to be dispatched correctly.
     */
    this.valueChanged(this.value);
  }

  private setRadioTabindex = (value: any | undefined) => {
    const radios = this.getRadios();

    // Get the first radio that is not disabled and the checked one
    const first = radios.find((radio) => !radio.disabled);
    const checked = radios.find((radio) => radio.value === value && !radio.disabled);

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
  };

  async connectedCallback() {
    // Get the list header if it exists and set the id
    // this is used to set aria-labelledby
    const header = this.el.querySelector('ion-list-header') || this.el.querySelector('ion-item-divider');
    if (header) {
      const label = (this.label = header.querySelector('ion-label'));
      if (label) {
        this.labelId = label.id = this.name + '-lbl';
      }
    }
  }

  private getRadios(): HTMLIonRadioElement[] {
    return Array.from(this.el.querySelectorAll('ion-radio'));
  }

  /**
   * Emits an `ionChange` event.
   *
   * This API should be called for user committed changes.
   * This API should not be used for external value changes.
   */
  private emitValueChange(event?: Event) {
    const { value } = this;
    this.ionChange.emit({ value, event });
  }

  private onClick = (ev: Event) => {
    ev.preventDefault();

    /**
     * The Radio Group component mandates that only one radio button
     * within the group can be selected at any given time. Since `ion-radio`
     * is a shadow DOM component, it cannot natively perform this behavior
     * using the `name` attribute.
     */
    const selectedRadio = ev.target && (ev.target as HTMLElement).closest('ion-radio');
    /**
     * Our current disabled prop definition causes Stencil to mark it
     * as optional. While this is not desired, fixing this behavior
     * in Stencil is a significant breaking change, so this effort is
     * being de-risked in STENCIL-917. Until then, we compromise
     * here by checking for falsy `disabled` values instead of strictly
     * checking `disabled === false`.
     */
    if (selectedRadio && !selectedRadio.disabled) {
      const currentValue = this.value;
      const newValue = selectedRadio.value;
      if (newValue !== currentValue) {
        this.value = newValue;
        this.emitValueChange(ev);
      } else if (this.allowEmptySelection) {
        this.value = undefined;
        this.emitValueChange(ev);
      }
    }
  };

  @Listen('keydown', { target: 'document' })
  onKeydown(ev: KeyboardEvent) {
    const inSelectPopover = !!this.el.closest('ion-select-popover');

    if (ev.target && !this.el.contains(ev.target as HTMLElement)) {
      return;
    }

    // Get all radios inside of the radio group and then
    // filter out disabled radios since we need to skip those
    const radios = this.getRadios().filter((radio) => !radio.disabled);

    // Only move the radio if the current focus is in the radio group
    if (ev.target && radios.includes(ev.target as HTMLIonRadioElement)) {
      const index = radios.findIndex((radio) => radio === ev.target);
      const current = radios[index];

      let next;

      // If hitting arrow down or arrow right, move to the next radio
      // If we're on the last radio, move to the first radio
      if (['ArrowDown', 'ArrowRight'].includes(ev.key)) {
        next = index === radios.length - 1 ? radios[0] : radios[index + 1];
      }

      // If hitting arrow up or arrow left, move to the previous radio
      // If we're on the first radio, move to the last radio
      if (['ArrowUp', 'ArrowLeft'].includes(ev.key)) {
        next = index === 0 ? radios[radios.length - 1] : radios[index - 1];
      }

      if (next && radios.includes(next)) {
        next.setFocus(ev);

        if (!inSelectPopover) {
          this.value = next.value;
          this.emitValueChange(ev);
        }
      }

      // Update the radio group value when a user presses the
      // space bar on top of a selected radio
      if ([' '].includes(ev.key)) {
        const previousValue = this.value;
        this.value = this.allowEmptySelection && this.value !== undefined ? undefined : current.value;
        if (previousValue !== this.value || this.allowEmptySelection) {
          /**
           * Value change should only be emitted if the value is different,
           * such as selecting a new radio with the space bar or if
           * the radio group allows for empty selection and the user
           * is deselecting a checked radio.
           */
          this.emitValueChange(ev);
        }

        // Prevent browsers from jumping
        // to the bottom of the screen
        ev.preventDefault();
      }
    }
  }

  render() {
    const { label, labelId, el, name, value } = this;
    const theme = getIonTheme(this);

    renderHiddenInput(true, el, name, value, false);

    return (
      <Host
        class={{
          [theme]: true,
        }}
        role="radiogroup"
        aria-labelledby={label ? labelId : null}
        onClick={this.onClick}
      ></Host>
    );
  }
}

let radioGroupIds = 0;
