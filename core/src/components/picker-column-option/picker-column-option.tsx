import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { inheritAttributes } from '@utils/helpers';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-picker-column-option',
  shadow: true,
})
export class PickerColumnOption implements ComponentInterface {
  private optionId = `ion-picker-opt-${pickerOptionIds++}`;

  @Element() el!: HTMLElement;

  /**
   * The aria-label of the option.
   *
   * If the value changes, then it will trigger a
   * re-render of the picker since it's a @State variable.
   * Otherwise, the `aria-label` attribute cannot be updated
   * after the component is loaded.
   */
  @State() ariaLabel?: string | null = null;

  /**
   * If `true`, the user cannot interact with the select option.
   */
  @Prop() disabled = false;

  /**
   * The text value of the option.
   */
  @Prop() value?: any | null;

  /**
   * The aria-label of the option has changed after the
   * first render and needs to be updated within the component.
   *
   * @param ariaLbl The new aria-label value.
   */
  @Watch('aria-label')
  onAriaLabelChange(ariaLbl: string) {
    this.ariaLabel = ariaLbl;
  }

  componentWillLoad() {
    const inheritedAttributes = inheritAttributes(this.el, ['aria-label']);
    /**
     * The initial value of `aria-label` needs to be set for
     * the first render.
     */
    this.ariaLabel = inheritedAttributes['aria-label'] || null;
  }

  render() {
    const { value, disabled, ariaLabel } = this;

    return (
      <Host id={this.optionId} class={getIonMode(this)}>
        <button
          tabindex="-1"
          aria-label={ariaLabel}
          class={{
            'picker-opt': true,
            'picker-opt-disabled': !!disabled,
          }}
          disabled={disabled}
        >
          <slot>{value}</slot>
        </button>
      </Host>
    );
  }
}

let pickerOptionIds = 0;
