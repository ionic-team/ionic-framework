import type { ComponentInterface } from '@stencil/core';
import { Component, Host, Prop, h, Element } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import { getIonMode, getIonCustomTheme } from '../../global/ionic-global';
import type { Color } from '../../interface';
import { generateCSSVars } from '../../themes/base/generate-css-vars';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 * @virtualProp {"ios" | "md" | "ionic"} theme - The theme determines the visual appearance of the component.
 */
@Component({
  tag: 'ion-my-chip',
  styleUrl: 'my-chip.base.scss',
  shadow: true,
})
export class MyChip implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * Display an outline style button.
   */
  @Prop() outline = false;

  /**
   * If `true`, the user cannot interact with the chip.
   */
  @Prop() disabled = false;

  /**
   * Set to `"bold"` for a chip with vibrant, bold colors or to `"subtle"` for
   * a chip with muted, subtle colors.
   *
   * Only applies to the `ionic` theme.
   */
  // THOUGHT: Comparing to ChakraUI, they use variants (aka fills) for this
  // maybe we should consider using variants: solid, outline, subtle
  // they use solid for bold solid background, no outline, has states
  // subtle for light background, no outline, has states
  // outline for outline style, no background, has states
  // surface for light background, with outline, has states
  // ghost for no background, no outline, has states
  // plain for no background, no outline, no states
  @Prop() hue?: 'bold' | 'subtle' = 'subtle';

  /**
   * Set to `"soft"` for a chip with slightly rounded corners, `"round"` for a chip with fully
   * rounded corners, or `"rectangular"` for a chip without rounded corners.
   * Defaults to `"round"` for the `"ionic"` theme and `"soft"` for all other themes.
   */
  @Prop() shape?: 'soft' | 'round' | 'rectangular' = 'soft';

  /**
   * Set to `"small"` for a chip with less height and padding.
   *
   * Defaults to `"large"` for the ionic theme, and  undefined for all other themes.
   */
  @Prop() size?: 'small' | 'large' = 'small';

  componentWillLoad() {
    const myCustomTheme = getIonCustomTheme();
    const componentTheme = myCustomTheme.components['IonChip'];

    // check if componentTheme is not an empty object or undefined
    if (componentTheme !== undefined || Object.keys(componentTheme).length > 0) {
      // apply a style tag to this component
      const style = document.createElement('style');
      style.innerHTML = [generateCSSVars(componentTheme, '--ion-', ':host')].join('\n\n');

      // Attach to Shadow Root if available, otherwise Light DOM
      const root = this.el.shadowRoot ?? this.el;
      root.appendChild(style);
    }
  }

  render() {
    const { hue, shape, size } = this;
    const mode = getIonMode(this);

    return (
      <Host
        aria-disabled={this.disabled ? 'true' : null}
        class={createColorClasses(this.color, {
          [`chip-${shape}`]: shape !== undefined,
          'chip-outline': this.outline,
          'chip-disabled': this.disabled,
          'ion-activatable': true,
          'ion-focusable': !this.disabled,
          [`chip-${size}`]: size !== undefined,
          [`chip-${hue}`]: hue !== undefined,
        })}
      >
        <slot></slot>
        {mode === 'md' && <ion-ripple-effect></ion-ripple-effect>}
      </Host>
    );
  }
}
