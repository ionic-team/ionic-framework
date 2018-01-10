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
   * The color to use for the background.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * If true, adds transparency to the card header.
   * Only affects `ios` mode. Defaults to `false`.
   */
  @Prop() translucent = false;

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
