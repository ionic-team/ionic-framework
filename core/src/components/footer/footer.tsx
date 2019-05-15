import { Component, ComponentInterface, Prop } from '@stencil/core';

import { Mode } from '../../interface';

@Component({
  tag: 'ion-footer',
  styleUrls: {
    ios: 'footer.ios.scss',
    md: 'footer.md.scss'
  }
})
export class Footer implements ComponentInterface {

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  /**
   * If `true`, the footer will be translucent.
   * Note: In order to scroll content behind the footer, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  hostData() {
    return {
      class: {
        [`${this.mode}`]: true,

        // Used internally for styling
        [`footer-${this.mode}`]: true,

        [`footer-translucent`]: this.translucent,
        [`footer-translucent-${this.mode}`]: this.translucent,
      }
    };
  }
}
