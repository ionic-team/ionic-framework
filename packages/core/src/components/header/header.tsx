import { Component, Prop } from '@stencil/core';

import { createThemedClasses } from '../../utils/theme';

@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss'
  },
  host: {
    theme: 'header'
  }
})
export class Header {
  mode: string;
  color: string;

  /**
   * If true, adds transparency to the header.
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   * Only affects `ios` mode. Defaults to `false`.
   */
  @Prop() translucent = false;

  hostData() {
    const themedClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'header-translucent') : {};

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
