import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

/**
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the divider text in LTR, and to the right in RTL.
 * @slot end - Content is placed to the right of the divider text in LTR, and to the left in RTL.
 */
@Component({
  tag: 'ion-item-divider',
  styleUrls: {
    ios: 'item-divider.ios.scss',
    md: 'item-divider.md.scss'
  },
  shadow: true
})
export class ItemDivider implements ComponentInterface {

  @Element() el!: HTMLElement;

  /**
   * The color to use from your application's color palette.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information on colors, see [theming](/docs/theming/basics).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * When it's set to `true`, the item-divider will stay visible when it reaches the top
   * of the viewport until the next `ion-item-divider` replaces it.
   *
   * This feature relies in `position:sticky`:
   * https://caniuse.com/#feat=css-sticky
   */
  @Prop() sticky = false;

  componentDidLoad() {
    // Change the button size to small for each ion-button in the item
    // unless the size is explicitly set
    Array.from(this.el.querySelectorAll('ion-button')).forEach(button => {
      if (button.size === undefined) {
        button.size = 'small';
      }
    });
  }

  hostData() {
    return {
      class: {
        ...createColorClasses(this.color),
        [`${this.mode}`]: true,
        'item-divider-sticky': this.sticky,
        'item': true,
      }
    };
  }

  render() {
    return [
      <slot name="start"></slot>,
      <div class="item-divider-inner">
        <div class="item-divider-wrapper">
          <slot></slot>
        </div>
        <slot name="end"></slot>
      </div>
    ];
  }
}
