import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, State, Watch, h } from '@stencil/core';
import { inheritAttributes } from '@utils/helpers';
import { createColorClasses } from '@utils/theme';

import { getIonMode } from '../../global/ionic-global';
import type { Color } from '../../interface';

@Component({
  tag: 'ion-picker-column-option',
  styleUrls: {
    ios: 'picker-column-option.ios.scss',
    md: 'picker-column-option.md.scss',
  },
  shadow: true,
})
export class PickerColumnOption implements ComponentInterface {
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
   * If `true`, the user cannot interact with the picker column option.
   */
  @Prop() disabled = false;

  /**
   * The text value of the option.
   */
  @Prop() value?: any | null;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color = 'primary';

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
    const { color, value, disabled, ariaLabel } = this;
    const mode = getIonMode(this);

    return (
      <Host
        class={createColorClasses(color, {
          [mode]: true,
          ['option-disabled']: disabled,
        })}
      >
        <button tabindex="-1" aria-label={ariaLabel} disabled={disabled}>
          <slot>{value}</slot>
        </button>
      </Host>
    );
  }
}
