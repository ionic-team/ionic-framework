import { Component, ComponentInterface, Prop, getMode } from '@stencil/core';

import { Mode } from '../../interface';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss'
  }
})
export class Header implements ComponentInterface {

  /**
   * If `true`, the header will be translucent.
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  hostData() {
    const mode = getMode<Mode>(this);
    return {
      class: {
        [`${mode}`]: true,

        // Used internally for styling
        [`header-${mode}`]: true,

        [`header-translucent`]: this.translucent,
        [`header-translucent-${mode}`]: this.translucent,
      }
    };
  }
}
