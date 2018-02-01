import { Component, Prop } from '@stencil/core';


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

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  render() {
    return [
      <slot name='start'></slot>,
      <div class='item-divider-inner'>
        <div class='item-divider-wrapper'>
          <slot></slot>
        </div>
        <slot name='end'></slot>
      </div>
    ];
  }
}
