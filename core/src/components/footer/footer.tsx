import { Component, ComponentInterface, Prop } from '@stencil/core';

import { getIonMode } from '../../global/ionic-global';

/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-footer',
  styleUrls: {
    ios: 'footer.ios.scss',
    md: 'footer.md.scss'
  }
})
export class Footer implements ComponentInterface {

  /**
   * If `true`, the footer will be translucent. Only applies to `ios` mode.
   * Note: In order to scroll content behind the footer, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  hostData() {
    const mode = getIonMode(this);
    return {
      class: {
        [mode]: true,

        // Used internally for styling
        [`footer-${mode}`]: true,

        [`footer-translucent`]: this.translucent,
        [`footer-translucent-${mode}`]: this.translucent,
      }
    };
  }
}
