import { Component, Prop } from '@stencil/core';

import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-card-header',
  styleUrls: {
    ios: 'card-header.ios.scss',
    md: 'card-header.md.scss'
  },
  host: {
    theme: 'card-header'
  }
})
export class CardHeader {
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

  /**
   * @input {boolean} If true, adds transparency to the card header.
   * Only affects `ios` mode. Defaults to `false`.
   */
  @Prop() translucent: boolean = false;

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'card-header-translucent') : {};

    const hostClasses = {
      ...themedClasses
    };

    return {
      class: hostClasses
    };
  }

  render() {
    return <slot></slot>;
  }
}
