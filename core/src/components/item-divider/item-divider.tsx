import { Component, Element, Prop } from '@stencil/core';
import { Color, Mode } from '../../interface';

@Component({
  tag: 'ion-item-divider',
  styleUrls: {
    ios: 'item-divider.ios.scss',
    md: 'item-divider.md.scss'
  },
  host: {
    theme: 'item-divider'
  }
})
export class ItemDivider {
  @Element() el!: HTMLElement;

  /**
   * The color to use for the item-divider
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
    const buttons = this.el.querySelectorAll('ion-button');
    for (let i = 0; i < buttons.length; i++) {
      if (!buttons[i].size) {
        buttons[i].size = 'small';
      }
    }
  }

  render() {
    return [
      <slot name="start" />,
      <div class="item-divider-inner">
        <div class="item-divider-wrapper">
          <slot />
        </div>
        <slot name="end" />
      </div>
    ];
  }
}
