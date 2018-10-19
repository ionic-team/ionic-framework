import { Component, ComponentInterface, Element, Prop } from '@stencil/core';

import { Color, Mode } from '../../interface';
import { createColorClasses } from '../../utils/theme';

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
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode!: Mode;

  componentDidLoad() {
    // Change the button size to small for each ion-button in the item
    // unless the size is explicitly set
    Array.from(this.el.querySelectorAll('ion-button')).forEach(button => {
      if (!button.size) {
        button.size = 'small';
      }
    });
  }

  hostData() {
    return {
      class: createColorClasses(this.color)
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
