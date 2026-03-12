import type { ComponentInterface } from '@stencil/core';
import { Component, Element, Host, Prop, h } from '@stencil/core';
import { createColorClasses } from '@utils/theme';

import type { Color } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines the platform behaviors of the component.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the divider text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the divider text in LTR, and to the left in RTL.
 */
@Component({
  tag: 'ion-item-divider',
  styleUrl: 'item-divider.scss',
  shadow: true,
})
export class ItemDivider implements ComponentInterface {
  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop({ reflect: true }) color?: Color;

  /**
   * When it's set to `true`, the item-divider will stay visible when it reaches the top
   * of the viewport until the next `ion-item-divider` replaces it.
   *
   * This feature relies in `position:sticky`:
   * https://caniuse.com/#feat=css-sticky
   */
  @Prop() sticky = false;

  render() {
    const { color, sticky } = this;

    return (
      <Host
        class={createColorClasses(color, {
          'item-divider-sticky': sticky,
          item: true,
        })}
      >
        <slot name="start"></slot>
        <div class="item-divider-inner">
          <div class="item-divider-wrapper">
            <slot></slot>
          </div>
          <slot name="end"></slot>
        </div>
      </Host>
    );
  }
}
