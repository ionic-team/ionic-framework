import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import type { Attributes } from '@utils/helpers';
import { inheritAriaAttributes } from '@utils/helpers';

import { getIonMode } from '../../global/ionic-global';

@Component({
  tag: 'ion-picker-column-option',
  shadow: true,
})
export class PickerColumnOption implements ComponentInterface {
  private optionId = `ion-picker-opt-${pickerOptionIds++}`;

  private inheritedAttributes: Attributes = {};

  @Element() el!: HTMLElement;

  /**
   * If `true`, the user cannot interact with the select option.
   */
  @Prop() disabled = false;

  /**
   * The text value of the option.
   */
  @Prop() value?: any | null;

  componentWillLoad() {
    this.inheritedAttributes = inheritAriaAttributes(this.el);
  }

  render() {
    const { value, disabled, inheritedAttributes } = this;
    const ariaLabel = inheritedAttributes['aria-label'] || null;

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
