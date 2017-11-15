import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'ion-card',
  styleUrls: {
    ios: 'card.ios.scss',
    md: 'card.md.scss'
  },
  host: {
    theme: 'card'
  }
})
export class Card {
  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  protected render() {
    return <slot></slot>;
  }
}
