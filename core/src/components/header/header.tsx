import { Component, ComponentInterface, Prop, getMode } from '@stencil/core';

import { Mode } from '../../interface';
import { createThemedClasses } from '../../utils/theme';

/**
 * @virtualProp {'md' | 'ios'} mode - The mode determines which platform styles to use.
 */
@Component({
  tag: 'ion-header',
  styleUrls: {
    ios: 'header.ios.scss',
    md: 'header.md.scss'
  }
})
export class Header implements ComponentInterface {

  private mode = getMode<Mode>(this);

  /**
   * If `true`, the header will be translucent.
   * Note: In order to scroll content behind the header, the `fullscreen`
   * attribute needs to be set on the content.
   */
  @Prop() translucent = false;

  hostData() {
    const themedClasses = createThemedClasses(this.mode, 'header');
    const translucentClasses = this.translucent ? createThemedClasses(this.mode, 'header-translucent') : null;

    return {
      class: {
        ...themedClasses,
        ...translucentClasses
      }
    };
  }
}
